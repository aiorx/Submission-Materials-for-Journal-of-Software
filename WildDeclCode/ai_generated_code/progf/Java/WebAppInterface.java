package com.example.demo;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import android.util.Log;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class WebAppInterface {
    Context mContext;

    /** Instantiate the interface and set the context. */
    WebAppInterface(Context c) {
        mContext = c;
    }

    /** the format is JSON */
    /** the config is Designed with routine coding tools */
    @JavascriptInterface
    public String getLayoutConfig() {
        SharedPreferences prefs = mContext.getSharedPreferences("com.example.demo", Context.MODE_PRIVATE);
        String config = prefs.getString("Config", "");
        Log.i("getLayoutConfig", config);
        return config;
    }

    /** receive the event from web action */
    @JavascriptInterface
    public void receiveEvent(String data) {
        Log.i("receiveEvent", data);
        // todo:: implement by thread pool and socket pool
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    // Connect to the host server
                    Socket socket = new Socket("localhost", 7890);

                    // Send data to the host
                    DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
                    dos.writeUTF(data);

                    // Close the connection
                    dos.close();
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
