```python
def print_header(name: str, desired_length: int = 30) -> None:
    rem_length = desired_length - len(name) - 2  # 2 for spaces
    prefix = int(rem_length / 2) * '='
    suffix = int(rem_length / 2 + 0.5) * '='
    header = f'{prefix} {name} {suffix}'
    print(header)
```