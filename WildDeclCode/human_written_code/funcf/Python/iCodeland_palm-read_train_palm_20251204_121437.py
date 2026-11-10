```python
def load_images(filenames, img_width, img_height):
    X = np.zeros((len(filenames), img_width, img_height, 3))
    for idx, fname in enumerate(filenames):
        X[idx, :, :, :] = np.array(
            Image.open(fname).resize((img_width, img_height)).getdata(),
            np.uint8,
        ).reshape(img_width, img_height, 3)
    return X
```