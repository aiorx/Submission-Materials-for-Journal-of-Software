```python
def getfontsizeforpixels(self, font_family, target_linespace, start=1, end=80, tolerance=1) -> list[int, int]:
    linespace = 0
    while start < end:
        mid = (start + end) // 2
        f = font.Font(family=font_family, size=mid)
        linespace = f.metrics('linespace')
        if abs(linespace - target_linespace) <= tolerance:
            print(f'fontsize {mid} for {linespace}px')
            return mid, linespace
        elif linespace < target_linespace:
            start = mid + 1
        else:
            end = mid - 1
    print(f'fontsize {start} for {linespace}px')
    return start, linespace
```