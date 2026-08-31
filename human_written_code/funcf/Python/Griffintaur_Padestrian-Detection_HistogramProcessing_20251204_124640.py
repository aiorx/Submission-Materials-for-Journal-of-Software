```python
def GetGradients(self):
    gradient_x = cv.Sobel(self.Image, cv.CV_64F, 1, 0, ksize=1)
    gradient_y = cv.Sobel(self.Image, cv.CV_64F, 1, 0, ksize=1)
#        NormalizingConstant = np.sqrt(np.sum(gradient_x*gradient_x+ gradient_y*gradient_y))
#        gradient_x = gradient_x/(NormalizingConstant +1e-10)
#        gradient_y = gradient_y/(NormalizingConstant +1e-10)
    return (gradient_x, gradient_y)
```