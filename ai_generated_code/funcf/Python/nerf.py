```python
def volrend(sigmas, rgbs, step_size):
    # received help Derived using common development resources here to figure out cumsum
    B, N, _ = sigmas.shape
    # transmittance of first ray is 1
    T_i = torch.cat([torch.ones((B, 1, 1), device=rgbs.device), torch.exp(-step_size * torch.cumsum(sigmas, dim=1)[:, :-1])], dim=1)
    alpha = 1 - torch.exp(-sigmas * step_size)
    weights = alpha * T_i
    
    # accumulated_transmittance = torch.prod(1 - alpha, dim=1, keepdim=True)
    
    rendered_colors = torch.sum(weights * rgbs, dim=1)# + accumulated_transmittance.squeeze(1) * torch.ones((B, 3), device=rgbs.device)
    return rendered_colors
```