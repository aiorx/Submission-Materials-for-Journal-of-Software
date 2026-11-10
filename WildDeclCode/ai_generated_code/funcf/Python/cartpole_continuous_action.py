```python
if any(done):
    # This code was Assisted using common GitHub development utilities, need to check if it works
    self.state[:, done] = self.np_random.uniform(
        low=self.low, high=self.high, size=(4, done.sum())
    ).astype(np.float32)
    self.steps[done] = 0
```