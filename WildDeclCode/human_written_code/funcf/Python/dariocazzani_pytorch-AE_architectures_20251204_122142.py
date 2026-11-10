```python
def get_flat_fts(self, fts):
    f = fts(Variable(torch.ones(1, *self.input_size)))
    return int(np.prod(f.size()[1:]))
```