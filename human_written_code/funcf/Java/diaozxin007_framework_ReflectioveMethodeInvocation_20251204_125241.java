```java
protected Object invokeOriginal() throws Throwable{
    return ReflectionUtils.invokeMethodUseReflection(target,method,arguments);
}
```