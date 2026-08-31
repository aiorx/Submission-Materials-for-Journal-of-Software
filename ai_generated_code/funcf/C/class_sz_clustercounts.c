```c
void shiftArray(double arr[], int size, int s) {
    double temp[s];
    int i;
    for (i = 0; i < s; i++) {
        temp[i] = arr[i];
    }
    for (i = s; i < size; i++) {
        arr[i - s] = arr[i];
    }
    for (i = 0; i < s; i++) {
        arr[size - s + i] = temp[i];
    }
}
```