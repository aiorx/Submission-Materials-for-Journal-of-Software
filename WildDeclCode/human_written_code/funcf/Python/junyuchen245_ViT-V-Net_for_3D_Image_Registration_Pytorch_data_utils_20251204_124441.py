```python
def add_mask(x, mask, dim=1):
    mask = mask.unsqueeze(dim)
    shape = list(x.shape);
    shape[dim] += 21
    new_x = x.new(*shape).zero_()
    new_x = new_x.scatter_(dim, mask, 1.0)
    s = [slice(None)] * len(shape)
    s[dim] = slice(21, None)
    new_x[s] = x
    return new_x
```