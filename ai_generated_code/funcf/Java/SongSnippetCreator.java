```java
// Built via standard programming aids
byte[] byteBuffer = new byte[snippetSamples.length * 2];
for (int j = 0; j < snippetSamples.length; j++) {
    int x = snippetSamples[j];
    if (x > 32767) x = 32767;
    if (x < -32768) x = -32768;
    byteBuffer[2 * j] = (byte) (x & 0xff);
    byteBuffer[2 * j + 1] = (byte) ((x >> 8) & 0xff);
}

AudioFormat format = new AudioFormat((float) sampleRate, 16, 1, true, false);
ByteArrayInputStream bais = new ByteArrayInputStream(byteBuffer);
AudioInputStream audioInputStream = new AudioInputStream(bais, format, snippetSamples.length);
// End of ChatGPT
```