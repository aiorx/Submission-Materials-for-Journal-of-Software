```cpp
double compute_partial_sum(int rank, int size, int N, double delta_x) {
    double sum = 0;
    for (int i = rank; i < N; i += size) {
        sum += delta_x * sqrt(1 - (i * delta_x) * (i * delta_x));
    }
    return sum;
}
```