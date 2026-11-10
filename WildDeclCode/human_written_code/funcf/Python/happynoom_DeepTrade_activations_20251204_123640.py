```python
def call(self, inputs):
    return K.relu(inputs, alpha=self.alpha, max_value=self.max_value)
```