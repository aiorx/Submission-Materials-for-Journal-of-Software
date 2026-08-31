```java
@Override
protected void onDestroy() {
    NetWatch.unregister(this);
    super.onDestroy();
}
```