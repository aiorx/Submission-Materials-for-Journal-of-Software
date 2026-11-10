```java
if (!TextUtils.isEmpty(profilePicString)) {
    try {
        if (profilePicString.contains(",")) {
            profilePicString = profilePicString.split(",")[1];
        }

        profilePicString = profilePicString.trim();

        byte[] decodedBytes = Base64.decode(profilePicString, Base64.DEFAULT);
        Bitmap decodedBitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

        if (decodedBitmap != null) {
            b.DisplayProfilePicture.setImageBitmap(decodedBitmap);
            Log.d("NOMLYPROCESS", "Image decoded successfully");
        } else {
            Log.e("NOMLYPROCESS", "Bitmap decoding returned null");
            b.DisplayProfilePicture.setImageResource(R.drawable.defaultprofile);
        }
    } catch (IllegalArgumentException e) {
        Log.e("NOMLYPROCESS", "Base64 decode failed: " + e.getMessage());
        b.DisplayProfilePicture.setImageResource(R.drawable.defaultprofile);
    }
} else {
    Log.w("NOMLYPROCESS", "profilePicString is empty");
    b.DisplayProfilePicture.setImageResource(R.drawable.defaultprofile);
}
```