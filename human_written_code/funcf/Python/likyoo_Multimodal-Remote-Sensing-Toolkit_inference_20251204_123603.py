```python
def convert_to_color(x):
    r"""Convert label map to color map."""
    if isinstance(x, torch.Tensor):
        x = x.detach().cpu().numpy()
    if len(x.shape) == 3:
        x = np.argmax(x, axis=1)
    x_color = np.zeros((x.shape[0], x.shape[1], 3), dtype=np.uint8)
    for k, v in palette.items():
        mask = x == k
        x_color[mask] = v
    return x_color
```