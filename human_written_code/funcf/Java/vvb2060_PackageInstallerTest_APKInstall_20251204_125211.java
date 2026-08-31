```java
private static void transfer(InputStream in, OutputStream out) throws IOException {
    int size = 8192;
    var buffer = new byte[size];
    int read;
    while ((read = in.read(buffer, 0, size)) >= 0) {
        out.write(buffer, 0, read);
    }
}
```