```python
def set_size(self, size):
    self._max_size = size
    if size < self.size():
        to_remove = self.size() - size
        self.data = self.data[to_remove:]
        self.cache.write(str(self.data) + "\n")
```