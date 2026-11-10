```python
    # Forward elimination
    # debug_print()
    for i in range(3):
        for j in range(i + 1, 4):
            m[j][i] = m[j][i] / m[i][i]
            # debug_print()
            for k in range(i + 1, 4):
                m[j][k] = m[j][k] - m[j][i] * m[i][k]
                # debug_print()
            b[j] = b[j] - m[j][i] * b[i]
            # debug_print()

    # Back substitution
    x = [0, 0, 0, 0]
    x[3] = b[3] / m[3][3]
    for i in range(2, -1, -1):
        x[i] = b[i]
        for j in range(i + 1, 4):
            x[i] = x[i] - m[i][j] * x[j]
        x[i] = x[i] / m[i][i]

    return x
```