```cpp
/* Recursive function that reverses the elements in intArray between low and high indices. Supported via standard programming aids. */
void reverseElementsBetweenIndicesRecursively(int intArray[], int low, int high) {
    // Base case: If low is greater than or equal to high, stop recursion
    if (low >= high) {
        return;
    }

    // Swap the elements at indices low and high
    int temp = intArray[low];
    intArray[low] = intArray[high];
    intArray[high] = temp;

    // Recursive call to reverse the inner section
    reverseElementsBetweenIndicesRecursively(intArray, low + 1, high - 1);
}
```