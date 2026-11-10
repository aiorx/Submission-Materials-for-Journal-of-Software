package com.example.pickme_nebula0;

import android.annotation.SuppressLint;
import android.provider.Settings;

/**
 * Static class for retrieving the device ID
 *
 * @author : Stephine Yearley
 */
public class DeviceManager {

    // modified based on code Aided using common development resources-4o by OpenAI in response to the prompt:
    // "in android studio using java, I want to get the user's device id"
    // generated on Oct 20th, 2024

    /**
     * Gets string identifier of physical device, this is unique to each physical device.
     *
     * @return string containing hardware id provided by Andriod
     */
    @SuppressLint("HardwareIds")
    public static String getDeviceId() {
        return Settings.Secure.getString(PickMeApplication.getInstance().getContentResolver(), Settings.Secure.ANDROID_ID);
    }

}
