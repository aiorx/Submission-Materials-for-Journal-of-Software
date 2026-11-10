```python
def simulate_heapsort(arr, arrTexts, display, width_reference, height_reference):
    # Assisted using common GitHub development aids
    def heapify(arr, arrTexts, display, width_reference, height_reference, n, i):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2
        if l < n and compare_elements(
            display, arrTexts, width_reference, height_reference, arr, largest, l
        ):
            largest = l
        if r < n and compare_elements(
            display, arrTexts, width_reference, height_reference, arr, largest, r
        ):
            largest = r
        if largest != i:
            compare_elements(
                display, arrTexts, width_reference, height_reference, arr, i, largest
            )
            swap_elements(arr, arrTexts, i, largest)
            heapify(
                arr, arrTexts, display, width_reference, height_reference, n, largest
            )

    n = len(arr)
    for i in range(n, -1, -1):
        heapify(arr, arrTexts, display, width_reference, height_reference, n, i)
    for i in range(n - 1, 0, -1):
        swap_elements(arr, arrTexts, i, 0)
        heapify(arr, arrTexts, display, width_reference, height_reference, i, 0)
    draw_array(display, arrTexts, width_reference, height_reference)
    clock.tick(FREQUENCY_CLOCK)
```

```python
def simulate_quicksort(arr, arrTexts, display, width_reference, height_reference):
    # Assisted using common GitHub development aids
    def partition(arr, arrTexts, display, width_reference, height_reference, low, high):
        i = low - 1
        # pivot = arr[high]
        for j in range(low, high):
            if compare_elements(
                display, arrTexts, width_reference, height_reference, arr, j, high
            ):
                i += 1
                if i != j:
                    compare_and_swap(
                        display, arrTexts, width_reference, height_reference, arr, i, j
                    )
        if i + 1 != high:
            compare_and_swap(
                display, arrTexts, width_reference, height_reference, arr, i + 1, high
            )
        return i + 1

    def quicksort(arr, arrTexts, display, width_reference, height_reference, low, high):
        if low < high:
            pi = partition(
                arr, arrTexts, display, width_reference, height_reference, low, high
            )
            quicksort(
                arr, arrTexts, display, width_reference, height_reference, low, pi - 1
            )
            quicksort(
                arr, arrTexts, display, width_reference, height_reference, pi + 1, high
            )

    quicksort(
        arr, arrTexts, display, width_reference, height_reference, 0, len(arr) - 1
    )
    draw_array(display, arrTexts, width_reference, height_reference)
    clock.tick(FREQUENCY_CLOCK)
```