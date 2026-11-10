```java
@Override
public boolean canHandle(String url) {
    return url.startsWith("jdbc:dm:");
}
```