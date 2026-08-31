```cpp
void progressBar(uint progress, uint total, uint width, uint iteration) {
    // Adapted from standard coding samples
    float percentage = (float)progress / total;
    uint filledWidth = ( uint)(percentage * width);
    printf("[");
    for ( uint i = 0; i < width; i++) {
        if (i < filledWidth) {
            printf("=");
        } else {
            printf(" ");
        }
    }
    printf("] %.2f%% : %d Frames\r", percentage * 100, iteration);
    fflush(stdout);
}
```