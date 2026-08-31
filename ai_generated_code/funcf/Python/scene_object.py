```python
def intersect(self, ray: Ray) -> float:
    # Aided via basic GitHub coding utilities
    x1 = ray.base.x
    y1 = ray.base.y
    x2 = ray.base.x + math.cos(ray.angle)
    y2 = ray.base.y + math.sin(ray.angle)
    x0 = self.center.x
    y0 = self.center.y
    r = self.radius

    a = (x2 - x1) ** 2 + (y2 - y1) ** 2
    b = 2 * ((x2 - x1) * (x1 - x0) + (y2 - y1) * (y1 - y0))
    c = x0 ** 2 + x1 ** 2 - 2 * x0 * x1 + y0 ** 2 + y1 ** 2 - 2 * y0 * y1 - r ** 2

    disc = b ** 2 - 4 * a * c
    if disc < 0:
        return None
    else:
        disc = math.sqrt(disc)

        t1 = (-b + disc) / (2 * a)
        t2 = (-b - disc) / (2 * a)

        t = min(t1, t2)
        if t < 0:
            return None
        else:
            return t
```