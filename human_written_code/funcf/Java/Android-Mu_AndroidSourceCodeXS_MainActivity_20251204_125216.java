```java
/**
 * 系统相册
 */
private void openAlbum() {
    Intent album_intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
    album_intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
    startActivityForResult(album_intent, ALBUM_REQUEST_CODE);
}
```