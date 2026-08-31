```java
private void showToast(final String toastMessage) {
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            if (toast == null) {
                toast = Toast.makeText(ChooseFunctionActivity.this, toastMessage, Toast.LENGTH_SHORT);
            } else {
                toast.setText(toastMessage);
            }
            toast.show();
        }
    });
}
```