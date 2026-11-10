```python
def paint(self):
    """painting on the surface"""
    y = self.offset_y
    for line in self.lines:
        self.draw_text(line, self.x, y, self.textcolor, self.bold )
        y+= self.dy
```