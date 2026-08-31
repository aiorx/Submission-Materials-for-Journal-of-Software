```java
private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
    /*
    formula to calculate distance between two coordinates (lat1,lng1) - (lat2,lng2)
    Code Assisted with basic coding tools
     */
    final int R = 6371000; // Radius of the Earth in meters
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}
```
```java
private void handleIfWithinTimeWindow(int startHour, int endHour, ICurrentTimeCallback callback) {
    /*
    gets the difference between the system's clock and the server's clock
    compares this value to startHour and endHour to see if user is within time window
    gives different callbacks to handle if the user is or isn't in the time window
    this method assures the user cannot trick the app by changing their system clock
    Code suggested by ChatGPT, modified
     */

    db.goOffline(); //we reconnect to the database to get a fresh time offset
    db.goOnline();
    DatabaseReference offsetRef = db.getReference(".info/serverTimeOffset");
    new Handler(Looper.getMainLooper()).postDelayed(() -> { //as the reconnection is asynchronous, give a delay before executing rest of code, Assisted with basic coding tools
        offsetRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                //takes a snapshot of the database from the DatabaseReference when fetched to get data from
                Long offset = snapshot.getValue(Long.class);
                Log.d("DatabaseManager", "Offset: " + offset);
                if (offset == null) {
                    callback.onTimeCheckFailed("Erreur");
                    return;
                }
                long estimatedServerTimeMs = System.currentTimeMillis() + offset;
                Log.d("DatabaseManager", "EstimatedServerTime: " + estimatedServerTimeMs);
                ZonedDateTime belgianTime = Instant.ofEpochMilli(estimatedServerTimeMs)
                        .atZone(ZoneId.of(TimeConfig.SERVER_TIMEZONE));
                int currentHour = belgianTime.getHour();

                boolean inWindow;
                if (startHour < endHour) { //handles if start hour is higher than end hour, so that Day Change is accounted for
                    inWindow = currentHour >= startHour && currentHour < endHour;
                } else {
                    inWindow = currentHour >= startHour || currentHour < endHour;
                }

                if (inWindow) {
                    callback.onWithinTimeWindow(currentHour);
                } else {
                    callback.onOutsideTimeWindow(currentHour);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                callback.onTimeCheckFailed(error.getMessage());
            }
        });
    }, 500);
}
```