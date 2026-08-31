```java
private void createNotificationChannel() {
    //Creates a channel for notifications, so that when the user mutes the app's notifications, it mutes their specified category
    //in this case, we put all our notifications in one channel

    CharSequence name = "In Plaine Sight daily notifications";
    String description = "Reminds the user about the daily word and results of their marker submission";
    //Code Aided using common development resources
    int importance = NotificationManager.IMPORTANCE_DEFAULT;
    NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
    channel.setDescription(description);

    NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
    notificationManager.createNotificationChannel(channel);
}
```