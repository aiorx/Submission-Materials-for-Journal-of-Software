```python
def _filter_impossible_name(self, name):
  if name in constants.RESERVED_TOKENS:
    return False
  else:
    return True
```