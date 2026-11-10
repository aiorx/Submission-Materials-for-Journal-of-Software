```java
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    ActivityCompat.requestPermissions(MainActivity.this,
            new String[] {
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
            }, 1);

    try {
        AudioTool.getInstance(this)
                .withAudio("/storage/emulated/0/Music/Linc - AudioTool.mp3")
                .applyEchoEffect(Echo.ECHO_FEW_MOUNTAINS, null)
                .saveCurrentTo("/storage/emulated/0/Music/Linc - AudioTool_With_Echo.mp3")
                .release();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```