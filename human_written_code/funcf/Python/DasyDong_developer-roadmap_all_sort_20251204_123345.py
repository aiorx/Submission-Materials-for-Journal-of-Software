```python
def merge(left, right):
    result = []
    while left and right:
        result.append(left.pop(0) if left[0] <= right[0] else right.pop(0))
    # while left:
        # result.append(left.pop(0))
    result.extend(left)
    result.extend(right)
    # while right:
        # result.append(right.pop(0))
    return result
```