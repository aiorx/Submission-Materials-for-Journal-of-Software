```python
def get_raw_input(input_str):
    if input_str is None:
        return sys.stdin
    return [input_str]
```