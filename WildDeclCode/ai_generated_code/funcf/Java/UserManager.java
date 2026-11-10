```java
private static String encrypt(String password) {
  // Code Aided using common development resources
  try {
    MessageDigest md = MessageDigest.getInstance("SHA-256");
    byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
    StringBuilder sb = new StringBuilder();
    for (byte b : hashedPassword) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  } catch (NoSuchAlgorithmException e) {
    e.printStackTrace();
    return null;
  }
}
```