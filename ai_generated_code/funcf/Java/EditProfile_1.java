```java
// Aided using common development resources - edited by jingyu
private String imageToB64(Bitmap bitmap) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
    byte[] imageBytes = baos.toByteArray();
    return Base64.encodeToString(imageBytes, Base64.NO_WRAP);
}
```