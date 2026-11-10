```java
public static <E extends Enum<E>> Stream<List<E>> generatePermutations(Class<E> enumType, int length) {
    if (length <= 0) {
        return Stream.empty(); // No permutations for non-positive length
    }

    // Get all enum constants
    E[] elements = enumType.getEnumConstants();

    // Use an iterative approach to generate permutations
    List<List<E>> result = new ArrayList<>();
    generatePermutationsIterative(elements, length, result);
    return result.stream();
}
```