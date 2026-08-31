```python
def __init__(self, *args, **kwargs):
    kwargs['editable'] = False
    kwargs['null'] = True
    kwargs['default'] = None
    super(LtreeField, self).__init__(*args, **kwargs)
```