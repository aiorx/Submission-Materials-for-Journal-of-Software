```python
class CustomFCOSConfig(FCOSConfig):
    def __init__(self):
        super(CustomFCOSConfig, self).__init__()
        self._register_configuration(_config_dict)
```