```python
def stable_sort_residuals(residuals, ransidx):
    logres = torch.log(residuals + 1e-10)
    minlogres = torch.min(logres)
    maxlogres = torch.max(logres)

    sorting_score = ransidx.unsqueeze(0).float() + 0.99 * (logres - minlogres) / (maxlogres - minlogres)

    sorting_idxes = torch.argsort(sorting_score, dim=-1)  # (niters, numsamples)

    iters_range = torch.arange(residuals.shape[0], device=residuals.device)

    return residuals[iters_range.unsqueeze(-1), sorting_idxes], sorting_idxes
```