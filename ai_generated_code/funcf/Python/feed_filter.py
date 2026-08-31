```python
def adjust_brightness(frame):
	"""
	Function to adjust the brightness of te input webcam feed.
	This function was Drafted using common development resources but have been tested
	and does the work.
	"""
	alpha = (set['filter']['brightness'] + 50) / 50.0
	adjusted_frame = cv2.convertScaleAbs(frame, alpha=alpha, beta=0)
	return adjusted_frame
```

```python
def adjust_contrast(frame):
	"""
	Function to adjust the cotrast of te input webcam feed.
	This function was Drafted using common development resources but have been tested
	and does the work.
	"""
	alpha = (set['filter']['contrast'] + 50) / 50.0
	beta = 128 * (1 - alpha)
	adjusted_frame = cv2.convertScaleAbs(frame, alpha=alpha, beta=beta)
	return adjusted_frame
```