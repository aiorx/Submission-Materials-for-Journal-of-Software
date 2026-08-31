```python
def load_checkpoint(self, checkpoint):
    """Load weights given a checkpoint object from training."""
    state_dict = {}
    for k, v in checkpoint['state_dict'].items():
        if k.startswith('module.'):
            state_dict[k[len('module.'):]] = v
    self.load_state_dict(state_dict)
```