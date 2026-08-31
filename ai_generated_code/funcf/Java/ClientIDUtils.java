```java
for (int i = digest.length - 20; i < digest.length; i++) {
    String hex = Integer.toHexString(0xff & digest[i]);
    if (hex.length() == 1) hexString.append('0');
    hexString.append(hex);
}
```