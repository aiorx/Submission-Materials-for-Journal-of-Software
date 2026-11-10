```python
def are_lines_intersecting(p1, p2, p3, p4):
    # Designed via basic programming aids
    # Unpack points
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3
    x4, y4 = p4

    # Calculate the determinant
    denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

    if denominator == 0:
        # Lines are parallel
        return False

    # Calculate the intersection parameters
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
    u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator

    # Check if the intersection point lies within the segments
    return 0 <= t <= 1 and 0 <= u <= 1
```