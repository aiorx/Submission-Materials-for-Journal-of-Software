```python
def is_falsy(check_obj):
    try:
        assert not check_obj._val
        return check_obj
    except AssertionError as ae:
        raise CheckError('{} is truthy'.format(check_obj._val)) from ae
```