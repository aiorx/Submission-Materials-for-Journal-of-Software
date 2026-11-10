```python
def draw(p1, p2, front=1):
    mlab.plot3d([p1[0], p2[0]], [p1[1], p2[1]], [p1[2], p2[2]],
                color=colors[names.index(lab) * 2 + front], tube_radius=None, line_width=2, figure=fig)
```