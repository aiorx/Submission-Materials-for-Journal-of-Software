```python
def is_active(self):
    return datetime.datetime.now() < self.created + self.deadline
```