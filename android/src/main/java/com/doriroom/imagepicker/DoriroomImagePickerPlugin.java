package com.suwith.doriroomimagepicker;

import android.content.Intent;
import android.net.Uri;
import android.app.Activity;
import android.provider.MediaStore;
import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginResult;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import org.json.JSONArray;

import java.util.ArrayList;

@CapacitorPlugin(name = "DoriroomImagePicker")
public class DoriroomImagePickerPlugin extends Plugin {

    private static final int IMAGE_PICKER_REQUEST = 12345;
    private PluginCall savedCall;

    @PluginMethod
    public void pickImages(PluginCall call) {
        int limit = call.getInt("limit", 5); // default 5
        savedCall = call;

        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setType("image/*");
        startActivityForResult(call, intent, IMAGE_PICKER_REQUEST);
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != IMAGE_PICKER_REQUEST) {
            return;
        }

        if (savedCall == null) return;

        ArrayList<String> paths = new ArrayList<>();

        if (resultCode == Activity.RESULT_OK && data != null) {
            if (data.getClipData() != null) {
                int count = data.getClipData().getItemCount();
                for (int i = 0; i < Math.min(count, 5); i++) {
                    Uri imageUri = data.getClipData().getItemAt(i).getUri();
                    paths.add(imageUri.toString());
                }
            } else if (data.getData() != null) {
                paths.add(data.getData().toString());
            }

            JSObject ret = new JSObject();
            ret.put("paths", new JSONArray(paths));
            savedCall.resolve(ret);
        } else {
            savedCall.reject("이미지를 선택하지 않았어요");
        }

        savedCall = null;
    }
}
