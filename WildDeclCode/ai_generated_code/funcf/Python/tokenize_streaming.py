```python
def count_non_pad_tokens(input_ids: torch.Tensor, tokenizer) -> int:
    # Composed with GitHub coding tools
    """
    Counts the total number of tokens that are not the pad token in a [bsz, input_ids] tensor.

    Args:
        input_ids (torch.Tensor): A tensor of shape [bsz, seq_len] containing token IDs.
        tokenizer: The tokenizer used, which provides the pad token ID.

    Returns:
        int: The total number of non-pad tokens.
    """
    pad_token_id = tokenizer.pad_token_id
    non_pad_tokens = (input_ids != pad_token_id).sum().item()
    return non_pad_tokens
```