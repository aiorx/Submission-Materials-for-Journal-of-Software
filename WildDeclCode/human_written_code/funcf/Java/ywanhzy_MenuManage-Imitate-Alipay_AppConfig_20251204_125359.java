```java
public String get(String key) {
	Properties props = get();
	return (props != null) ? props.getProperty(key) : null;
}
```