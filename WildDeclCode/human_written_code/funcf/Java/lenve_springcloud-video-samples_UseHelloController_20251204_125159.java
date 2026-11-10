```java
@GetMapping("/hello3")
public String hello3() {
    return restTemplate.getForObject("http://provider/hello", String.class);
}
```