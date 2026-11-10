```python
def create_rounded_rectangle(self, x1, y1, x2, y2, r, **kwargs):
    points = [x1 + r, y1, x1 + r, y1, x2 - r, y1, x2 - r, y1, x2, y1, x2, y1 + r, x2, y1 + r, x2, y2 - r,
              x2, y2 - r, x2, y2, x2 - r, y2, x2 - r, y2, x1 + r, y2, x1 + r, y2, x1, y2, x1, y2 - r, x1, y2 - r,
              x1, y1 + r, x1, y1 + r, x1, y1]
    return self.create_polygon(points, **kwargs, smooth=True)
```