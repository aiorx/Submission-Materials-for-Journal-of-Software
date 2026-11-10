```python
class StringConstant(object):
    def __init__(self, name: str):
        self.name = name.lower()

    def __str__(self):
        return self.name

    def __hash__(self):
        return hash(self.name)

    def __eq__(self, other):
        return str(other) == self.name

    def __ne__(self, other):
        return str(other).lower() != self.name

    def __repr__(self):
        return self.name
```