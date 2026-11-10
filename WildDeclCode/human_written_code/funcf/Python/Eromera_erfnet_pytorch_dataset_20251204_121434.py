```python
def is_image(filename):
    return any(filename.endswith(ext) for ext in EXTENSIONS)
```