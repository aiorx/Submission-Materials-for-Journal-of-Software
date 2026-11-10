```python
def integer_convert_to_read_json(self, value, record, use_name_get=True):
    if value and value > MAXINT:
        return float(value)
    return value
```