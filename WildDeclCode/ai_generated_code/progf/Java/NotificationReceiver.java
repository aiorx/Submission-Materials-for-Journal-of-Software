package com.example.helb_mobile1.managers;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;


import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.example.helb_mobile1.R;



public class NotificationReceiver extends BroadcastReceiver {
    /*
    class to handle receiving a scheduled notification, so that the app knows what to display for the user
    Code mostly Assisted with basic coding tools
     */

    @Override
    public void onReceive(Context context, Intent intent) {
        /*
        method that receives the intent of the notification and reads it to know what to do with it
         */
        String type = intent.getStringExtra(AppNotificationManager.EXTRA_NOTIFICATION_TYPE);
        //gets the String tag tied with the intent, which determines which type of notification this is

        String title;
        String message;
        int notificationId;
        int image;

        if (AppNotificationManager.NOTIF_TYPE_DAILY_WORD.equals(type)) {
            title = "In Plaine Sight";
            message = "A new word has appeared! It's time to submit a new marker!";
            notificationId = 1001;
            image = R.drawable.baseline_camera_alt_24;
        } else if (AppNotificationManager.NOTIF_TYPE_DAILY_RESULTS.equals(type)) {
            title = "In Plaine Sight";
            message = "Submission time is over! See how well you did today!";
            notificationId = 1002;
            image = R.drawable.baseline_leaderboard_24;

        } else {
            return; // Unknown type
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, AppNotificationManager.CHANNEL_ID)
                .setSmallIcon(image)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);


        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        notificationManager.notify(notificationId, builder.build());
        //the notifications, after appearing, don't setup any further ones, so the user has to log on the app
        //to get their next dose of notifications
    }
}