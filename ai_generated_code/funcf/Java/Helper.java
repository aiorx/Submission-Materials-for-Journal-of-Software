```java
public static double getSignedCoordinate(Vec3 vec, Direction direction) {
    // fully Penned via standard GitHub programming aids
    return switch (direction) {
        case DOWN -> -vec.y;
        case UP -> vec.y;
        case NORTH -> -vec.z;
        case SOUTH -> vec.z;
        case WEST -> -vec.x;
        case EAST -> vec.x;
        default -> throw new RuntimeException();
    };
}
```