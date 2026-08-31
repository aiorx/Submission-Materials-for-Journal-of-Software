```python
if any(done):
    # This code was Supported via standard GitHub programming aids, need to check if it works
    self.state[:, done] = self.np_random.uniform(
        low=self.low, high=self.high, size=(4, done.sum())
    ).astype(np.float32)
    self.steps[done] = 0
```