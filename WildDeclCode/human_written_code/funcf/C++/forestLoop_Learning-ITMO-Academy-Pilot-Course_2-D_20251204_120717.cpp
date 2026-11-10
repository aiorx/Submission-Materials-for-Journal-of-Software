```cpp
auto ballonNum = [&t, &z, &y](int i, int time) {
    auto period = t[i] * z[i] + y[i];
    return time / period * z[i] + min((time % period) / t[i], z[i]);
};
```