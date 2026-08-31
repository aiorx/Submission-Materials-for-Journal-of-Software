```java
/**
 * 将中文字符转码发送
 *
 * @param strSend
 */
private byte[] createSendData(String strSend) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    DataOutputStream dataStream = new DataOutputStream(baos);
    try {
        dataStream.writeUTF(strSend);
        dataStream.close();
        return baos.toByteArray();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return new byte[0];
}
```