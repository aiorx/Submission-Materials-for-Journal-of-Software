```python
def _format_ns(time_ns):
    suffixes = ['ns', 'us', 'ms', 's']

    index = 0
    while time_ns >= 1000 and index < len(suffixes):
        index += 1
        time_ns /= 1000

    return "%s%s" % (time_ns, suffixes[index])
```