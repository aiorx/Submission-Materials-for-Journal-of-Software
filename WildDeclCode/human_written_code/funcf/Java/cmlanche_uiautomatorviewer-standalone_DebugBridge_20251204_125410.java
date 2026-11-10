```java
private static String getAdbLocation() {
    if (System.getProperty("os.name").toLowerCase().contains("mac")) {
        return System.getProperty("user.dir") + File.separator + "adb";
    }
    return System.getProperty("user.dir") + File.separator + "adb.exe";
}
```