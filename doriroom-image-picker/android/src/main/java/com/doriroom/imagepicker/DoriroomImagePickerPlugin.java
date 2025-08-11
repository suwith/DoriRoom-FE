package com.suwith.doriroomimagepicker;

import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;

@CapacitorPlugin(
    name = "DoriroomImagePicker",
    permissions = {
        @Permission(alias = "photos13Plus", strings = {
            "android.permission.READ_MEDIA_IMAGES"
        }),
        @Permission(alias = "photosLegacy", strings = {
            "android.permission.READ_EXTERNAL_STORAGE"
        })
    }
)
public class DoriroomImagePickerPlugin extends Plugin {

    private static final String TAG = "DoriroomImagePicker";
    private static final int MAX_PICK = 5;

    private PluginCall savedCall;

    private String photosAlias() {
        return android.os.Build.VERSION.SDK_INT >= 33 ? "photos13Plus" : "photosLegacy";
    }

    @PluginMethod
    public void pickImages(PluginCall call) {
        PermissionState state = getPermissionState(photosAlias());
        Log.d(TAG, "pickImages() - permission state = " + state);

        // 권한이 꼭 필요하진 않지만(포토 피커는 무권한), 기존 로직 유지
        if (state != PermissionState.GRANTED) {
            savedCall = call;
            requestPermissionForAlias(photosAlias(), call, "imagesPermsCallback");
        } else {
            launchImagePicker(call);
        }
    }

    @PermissionCallback
    private void imagesPermsCallback(PluginCall call) {
        if (getPermissionState(photosAlias()) == PermissionState.GRANTED) {
            launchImagePicker(call);
        } else {
            if (call != null) call.reject("사진 접근 권한이 필요합니다.");
            this.savedCall = null;
        }
    }

    private void launchImagePicker(PluginCall call) {
        Log.d(TAG, "launchImagePicker()");
        this.savedCall = call;

        final Intent intent;
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            // Android 13+ 시스템 포토 피커 (권장, 권한 불필요)
            intent = new Intent(MediaStore.ACTION_PICK_IMAGES);
            intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, MAX_PICK);
        } else {
            // 레거시: SAF
            intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("image/*");
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
        }
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        Intent chooser = Intent.createChooser(intent, "이미지 선택");
        // 문자열 콜백 이름(Capacitor 5)
        startActivityForResult(call, chooser, "onImagesPicked");
    }

    @ActivityCallback
    private void onImagesPicked(PluginCall call, ActivityResult result) {
        Log.d(TAG, "onImagesPicked() resultCode=" + (result != null ? result.getResultCode() : -1));

        if (call == null) {
            Log.e(TAG, "PluginCall is null. Cannot deliver result.");
            this.savedCall = null;
            return;
        }

        ArrayList<JSObject> items = new ArrayList<>();

        if (result != null && result.getResultCode() == Activity.RESULT_OK) {
            Intent data = result.getData();
            if (data != null) {
                if (data.getClipData() != null) {
                    int count = Math.min(data.getClipData().getItemCount(), MAX_PICK);
                    for (int i = 0; i < count; i++) {
                        Uri uri = data.getClipData().getItemAt(i).getUri();
                        items.add(buildReturnItemFromUri(uri));
                    }
                } else if (data.getData() != null) {
                    items.add(buildReturnItemFromUri(data.getData()));
                }
            }
        } else {
            call.reject("이미지를 선택하지 않았습니다.");
            this.savedCall = null;
            return;
        }

        JSObject res = new JSObject();
        res.put("items", new JSONArray(items));
        call.resolve(res);
        this.savedCall = null;
    }

    /** content:// -> cache 파일로 복사하고, webPath(로컬호스트 URL) 생성 */
    private JSObject buildReturnItemFromUri(Uri uri) {
        String fileName = getDisplayName(uri);
        if (fileName == null || fileName.trim().isEmpty()) {
            fileName = "IMG_" + System.currentTimeMillis() + ".jpg";
        }
        String mime = getContext().getContentResolver().getType(uri);
        File outFile = new File(getContext().getCacheDir(), fileName);

        try (InputStream in = getContext().getContentResolver().openInputStream(uri);
             OutputStream out = new FileOutputStream(outFile)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        } catch (Exception e) {
            Log.e(TAG, "copy failed: " + uri, e);
        }

        String absPath = outFile.getAbsolutePath();            // /data/.../cache/xxx.jpg
        String fileUri = Uri.fromFile(outFile).toString();     // file://...
        String webPath = getBridge().getLocalUrlForFullPath(absPath); // http://localhost/_capacitor_file_/...

        JSObject obj = new JSObject();
        obj.put("path", fileUri);
        obj.put("webPath", webPath);
        obj.put("mimeType", mime != null ? mime : "");
        obj.put("fileName", fileName);
        return obj;
    }

    private String getDisplayName(Uri uri) {
        try (Cursor c = getContext().getContentResolver()
            .query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst()) {
                int idx = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (idx >= 0) return c.getString(idx);
            }
        } catch (Exception ignore) {}
        return null;
    }
}
