```python
def center_resize(img):
	assert(IMAGE_W == IMAGE_H)
	w, h = img.shape[0], img.shape[1]
	if w > h:
		x = (w-h)/2
		img = img[x:x+h,:]
	elif h > w:
		img = img[:,0:w]
	return cv2.resize(img, (IMAGE_W, IMAGE_H), interpolation = cv2.INTER_LINEAR)
```