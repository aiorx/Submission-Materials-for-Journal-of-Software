```python
def transform(self, img):
    img = img[:, :, ::-1]  # RGB -> BGR
    img = img.astype(np.float32)
    img -= self.mean_bgr
    img = img.transpose(2, 0, 1)  # C x H x W
    img = torch.from_numpy(img).float()
    return img
```