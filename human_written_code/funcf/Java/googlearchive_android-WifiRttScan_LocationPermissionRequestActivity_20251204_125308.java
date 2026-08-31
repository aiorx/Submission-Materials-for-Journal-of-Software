```java
public void onClickApprovePermissionRequest(View view) {
    Log.d(TAG, "onClickApprovePermissionRequest()");

    // On 23+ (M+) devices, fine location permission not granted. Request permission.
    ActivityCompat.requestPermissions(
            this,
            new String[] {Manifest.permission.ACCESS_FINE_LOCATION},
            PERMISSION_REQUEST_FINE_LOCATION);
}
```