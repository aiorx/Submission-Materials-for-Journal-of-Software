```c
void xorLoopEncryptor(unsigned char* data, unsigned int size) {
    unsigned int j = 0;
    for (unsigned int i = 0; i < (size - 1); i++) {
        j = i + 1;
        if (i == size - 2) {
            j = j - size + 1;
        }
        data[i] = data[i] ^ data[j] + size;
    }
}
```