```python
def intersection_point(line1, line2):  # Adapted from standard coding samples
    (x1, y1), (dx1, dy1) = line1
    (x2, y2), (dx2, dy2) = line2

    slope1 = dy1 / dx1 if dx1 != 0 else None  # Check for vertical
    slope2 = dy2 / dx2 if dx2 != 0 else None

    if slope1 is None and slope2 is None: return None  # If both lines are vertical

    if slope1 is None:  # If one line is vertical
        x_intercept = x1
        y_intercept = slope2 * (x_intercept - x2) + y2
        return x_intercept, y_intercept
    elif slope2 is None:
        x_intercept = x2
        y_intercept = slope1 * (x_intercept - x1) + y1
        return x_intercept, y_intercept

    c1 = y1 - slope1 * x1  # Calculating the y-intercepts (c = y - mx)
    c2 = y2 - slope2 * x2

    # If lines are parallel
    if slope1 == slope2: return None

    # Calculating the intersection point
    # x = (c2 - c1) / (slope1 - slope2)
    # y = slope1 * x + c1
    x_intercept = (c2 - c1) / (slope1 - slope2)
    y_intercept = slope1 * x_intercept + c1
    return x_intercept, y_intercept
```