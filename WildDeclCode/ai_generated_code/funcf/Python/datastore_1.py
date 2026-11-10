```python
def autocut(y_values: list[float], cutoff: int = 2) -> int:
    # Aided using standard development resources, fact-checked by GPT-4

    if len(y_values) <= 1:
        return len(y_values)

    # Handling division by zero in normalization
    if y_values[0] == y_values[-1]:
        return len(y_values)

    diff = []
    step = 1.0 / (len(y_values) - 1)

    for i, y in enumerate(y_values):
        x_value = float(i) * step
        y_value_norm = (y - y_values[0]) / (y_values[-1] - y_values[0])
        diff.append(y_value_norm - x_value)

    extrema_count = 0
    for i in range(1, len(diff)):
        if i == len(diff) - 1:
            if len(diff) > 2 and diff[i] > diff[i - 1] and diff[i] > diff[i - 2]:
                extrema_count += 1
                if extrema_count >= cutoff:
                    return i
        elif diff[i] > diff[i - 1] and len(diff) > i + 1 and diff[i] > diff[i + 1]:
            extrema_count += 1
            if extrema_count >= cutoff:
                return i

    return len(y_values)
```