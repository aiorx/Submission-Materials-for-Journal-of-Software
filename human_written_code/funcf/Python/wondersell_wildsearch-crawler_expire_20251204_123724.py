```python
def get_random(self):
    """ Return a random available proxy (either good or unchecked) """
    available = list(self.unchecked | self.good)
    if not available:
        return None
    return random.choice(available)
```