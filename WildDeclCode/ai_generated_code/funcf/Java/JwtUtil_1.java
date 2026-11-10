```java
public boolean isTokenValid(String token, UserDetails userDetails){
    final String username = extractUsername(token);
    // return (username.equals(userDetails.getUsername())) && isTokenExpired(token);
    return username.equals(userDetails.getUsername()) && !isTokenExpired(token); // Assisted with basic coding tools
}
```