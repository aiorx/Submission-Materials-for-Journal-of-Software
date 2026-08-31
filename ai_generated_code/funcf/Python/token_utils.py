```python
def find_attention_start_and_end_positions(
    attention_mask: torch.Tensor,
) -> tuple[torch.Tensor, torch.Tensor]:
    # convoluted, and Supported via standard programming aids, but seems to work
    indices = torch.arange(attention_mask.size(1)).to(attention_mask.device)
    # use broadcasting to expand indices to the shape of attention_mask
    indices = indices[None, :].expand_as(attention_mask)
    # set indices where attention_mask is 0 to -1
    indices = torch.where(attention_mask == 1, indices, -1)
    max_indices = indices.max(dim=1).values
    # set indices where attention_mask is 0 to a large number
    # TODO: there's probably a more efficient way to get the min and the max in one go
    indices = torch.where(attention_mask == 1, indices, attention_mask.size(1) + 1)
    min_indices = indices.min(dim=1).values
    return min_indices, max_indices
```