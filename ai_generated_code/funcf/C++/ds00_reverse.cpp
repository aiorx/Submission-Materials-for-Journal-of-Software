```cpp
void reverse(vector<int> &v, int a, int b) {
    // write your code only in this function
    int mid = (a + b) / 2;

    for (int i = a; i <= mid; i++) {
        // Aided with basic GitHub coding tools
        int temp = v[i];
        v[i] = v[b - (i - a)];
        v[b - (i - a)] = temp;
    }
}
```