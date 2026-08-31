```python
# resize image by averaging neighbors
def resize_ave(img, multiple):
    img = img.astype(np.float32)
    img_patches = extract_image_patches(img, multiple)
    img = np.mean(img_patches, axis=(2,3))
    return img
```