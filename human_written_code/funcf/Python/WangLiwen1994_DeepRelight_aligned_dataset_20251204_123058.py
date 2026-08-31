```python
def getShadow(self, PIL_img):
    img_BGR = cv2.cvtColor(np.asarray(PIL_img), cv2.COLOR_RGB2BGR)
    RGBsum = np.sum(img_BGR, axis=2) / 3.0
    mask = np.zeros_like(RGBsum)
    mask[RGBsum < 15] = 1
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=1)
    return mask
```