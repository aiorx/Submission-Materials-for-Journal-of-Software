```java
private static void downloadFileFromURL(String urlString, File destination) throws IOException {
    URL url = new URL(urlString);
    ReadableByteChannel rbc = Channels.newChannel(url.openStream());
    FileOutputStream fos = new FileOutputStream(destination);
    try {
        fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
    } finally {
        fos.close();
        rbc.close();
    }
}
```