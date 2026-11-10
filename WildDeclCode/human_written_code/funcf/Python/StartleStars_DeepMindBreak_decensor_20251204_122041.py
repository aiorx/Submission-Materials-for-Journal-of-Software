```python
def get_mask(x_batch):
    points = []
    mask = []
    for i in range(BATCH_SIZE):
        raw = x_batch[i]
        raw = np.array((raw + 1) * 127.5, dtype=np.uint8)
        m = np.zeros((IMAGE_SIZE, IMAGE_SIZE, 1), dtype=np.uint8)
        for x in range(IMAGE_SIZE):
            for y in range(IMAGE_SIZE):
                if np.array_equal(raw[x][y], [0, 255, 0]):
                    m[x, y] = 1
        mask.append(m)
    return np.array(mask)
```