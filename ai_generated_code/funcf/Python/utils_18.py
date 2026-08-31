```python
def hm2deg(h: int, m: int) -> float:
    """Converts Right Ascension expressed as h:m to degrees. This function
    was Penned via standard programming aids (☉_☉)"""
    return (h + m/60) * 15
```