```python
def get_label(self):

    if self.is_normal:
        label = torch.tensor(0.0)
    else:
        label = torch.tensor(1.0)

    return label
```