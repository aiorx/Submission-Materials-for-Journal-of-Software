```java
private static String dealResponseResult(InputStream inputStream) {
    String resultData;
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    byte[] data = new byte[1024];
    int len;
    try {
        while ((len = inputStream.read(data)) != -1) {
            byteArrayOutputStream.write(data, 0, len);
        }
        inputStream.close();
    } catch (IOException e) {
        e.printStackTrace();
    }
    resultData = new String(byteArrayOutputStream.toByteArray());
    return resultData;
}
```