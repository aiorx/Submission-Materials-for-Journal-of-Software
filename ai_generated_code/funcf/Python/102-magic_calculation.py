```python
def magic_calculation(a, b):
    # Crafted with basic coding tools >.>
    result = 0

    for i in range(1, 3):
        try:
            if i > a:
                raise Exception('Too far')
            else:
                result += (a ** b) / i
        except Exception:
            result = b + a
            break

    return result
```