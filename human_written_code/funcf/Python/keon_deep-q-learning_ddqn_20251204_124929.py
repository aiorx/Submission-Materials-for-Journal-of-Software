```python
def update_target_model(self):
    # copy weights from model to target_model
    self.target_model.set_weights(self.model.get_weights())
```