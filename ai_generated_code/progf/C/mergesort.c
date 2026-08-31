#include <stdio.h>
#include <stdlib.h>

// Function to merge two halves
void merge(int *arr, int *left, int leftSize, int *right, int rightSize) {
    int i = 0, j = 0, k = 0;

    // Merge elements from left and right arrays in sorted order
    while (i < leftSize && j < rightSize) {
        if (left[i] < right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }

    // Copy remaining elements from left array, if any
    while (i < leftSize) {
        arr[k++] = left[i++];
    }

    // Copy remaining elements from right array, if any
    while (j < rightSize) {
        arr[k++] = right[j++];
    }
}

// Recursive merge sort function
void mergeSort(int *arr, int size) {
    if (size < 2) {
        return; // Base case: an array of size 0 or 1 is already sorted
    }

    // Split array into two halves
    int mid = size / 2;
    int *left = (int *)malloc(mid * sizeof(int));
    int *right = (int *)malloc((size - mid) * sizeof(int));

    // Copy data to left and right arrays
    for (int i = 0; i < mid; i++) {
        left[i] = arr[i];
    }
    for (int i = mid; i < size; i++) {
        right[i - mid] = arr[i];
    }

    // Recursively sort the two halves
    mergeSort(left, mid);
    mergeSort(right, size - mid);

    // Merge the sorted halves
    merge(arr, left, mid, right, size - mid);

    // Free the temporary arrays
    free(left);
    free(right);
}

// Helper function to print the array
void printArray(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// Main function
int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int size = sizeof(arr) / sizeof(arr[0]);

    printf("Original array:\n");
    printArray(arr, size);

    mergeSort(arr, size);

    printf("Sorted array:\n");
    printArray(arr, size);

    return 0;
}

// Drafted using common development resources