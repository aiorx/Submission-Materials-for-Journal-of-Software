```java
private void doImport(ArrayList<Uri> stickers, ArrayList<String> emojis) {
    Intent intent = new Intent(CREATE_STICKER_PACK_ACTION);
    intent.putExtra(Intent.EXTRA_STREAM, stickers);
    intent.putExtra(CREATE_STICKER_PACK_IMPORTER_EXTRA, getPackageName());
    intent.putExtra(CREATE_STICKER_PACK_EMOJIS_EXTRA, emojis);
    intent.setType("image/*");
    try {
        startActivity(intent);
    } catch (Exception e) {
        e.printStackTrace();
        //no activity to handle intent
    }
}
```