```python
def draw_ovals_and_lines(canvas, x0, y0):
    import math
    canvas.create_oval(x0 - 10, y0 - 10, x0 + 10, y0 + 10)
    canvas.create_oval(x0 - 20, y0 - 20, x0 + 20, y0 + 20)
    canvas.create_oval(x0 - 50, y0 - 50, x0 + 50, y0 + 50)
    B = 0.809
    for i in range(16):
        a = 2 * math.pi / 16 * i
        x = math.ceil(x0 + 48 * math.cos(a))
        y = math.ceil(y0 + 48 * math.sin(a) * B)
        canvas.create_line(x0, y0, x, y, fill='red')
    canvas.create_oval(x0 - 60, y0 - 60, x0 + 60, y0 + 60)
```