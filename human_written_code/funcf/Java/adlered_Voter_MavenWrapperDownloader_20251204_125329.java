```java
private static void downloadFileFromURL(String urlString, File destination) throws IOException {
    URL url = new URL(urlString);
    try (ReadableByteChannel readableByteChannel = Channels.newChannel(url.openStream());
         FileOutputStream fileOutputStream = new FileOutputStream(destination)) {
        fileOutputStream.getChannel().transferFrom(readableByteChannel, 0, Long.MAX_VALUE);
    }
}
```