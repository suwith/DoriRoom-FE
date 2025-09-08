package com.doritos.doriroom;

import com.getcapacitor.BridgeActivity;
import com.suwith.doriroomimagepicker.DoriroomImagePickerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        registerPlugin(DoriroomImagePickerPlugin.class);
    }
}
