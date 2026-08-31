```python
def digitMatch(S):
    for ch in S:
        if ord(ch) not in range(48, 58):
            return False
    return True
```