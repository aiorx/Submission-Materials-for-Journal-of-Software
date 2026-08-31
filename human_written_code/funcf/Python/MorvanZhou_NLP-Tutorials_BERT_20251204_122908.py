```python
def do_mask(seq, len_arange, pad_id, mask_id):
    loss_mask, rand_id = _get_loss_mask(len_arange, seq, pad_id)
    seq[rand_id] = mask_id
    return loss_mask
```