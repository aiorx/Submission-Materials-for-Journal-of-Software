```python
def draw(event, x, y, flags, img):
    if flags == 1:
        apply_patch(img, x, y, size=config.patch_size)
```