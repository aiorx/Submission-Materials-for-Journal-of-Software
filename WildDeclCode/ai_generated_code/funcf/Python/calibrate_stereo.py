```python
def load_images(path, depth=False) -> Dict[str, any]:
    images = {}
    for file_name in os.listdir(path):
        file = os.path.join(path, file_name)
        if os.path.isfile(file):
            img = cv.imread(file, cv.IMREAD_GRAYSCALE if depth else cv.IMREAD_COLOR)
            if not depth:
                img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
            images[file_name] = img
    return images
```