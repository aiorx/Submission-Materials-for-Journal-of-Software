```java
@Bean
@ConditionalOnMissingBean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```