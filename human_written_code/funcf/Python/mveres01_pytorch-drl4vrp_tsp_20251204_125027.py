```python
def update_mask(mask, dynamic, chosen_idx):
    """Marks the visited city, so it can't be selected a second time."""
    mask.scatter_(1, chosen_idx.unsqueeze(1), 0)
    return mask
```