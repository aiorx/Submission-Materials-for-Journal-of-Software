```java
private float clamp(float num, float min, float max) { 
    return num < min ? min : (num > max ? max : num); 
}
```