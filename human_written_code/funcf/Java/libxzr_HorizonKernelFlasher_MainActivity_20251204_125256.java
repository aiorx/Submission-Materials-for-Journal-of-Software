```java
void update_title() {
    runOnUiThread(() -> {
        switch (cur_status) {
            case error:
                setTitle(R.string.failed);
                break;
            case flashing:
                setTitle(R.string.flashing);
                break;
            case flashing_done:
                setTitle(R.string.flashing_done);
                break;
            default:
                setTitle(R.string.app_name);
        }
    });
}
```