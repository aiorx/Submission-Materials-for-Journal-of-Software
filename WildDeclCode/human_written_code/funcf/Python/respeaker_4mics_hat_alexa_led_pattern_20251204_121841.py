```python
def wakeup(self, direction=0):
    position = int((direction + 15) / (360 / self.pixels_number)) % self.pixels_number

    pixels = [0, 0, 0, 24] * self.pixels_number
    pixels[position * 4 + 2] = 48

    self.show(pixels)
```