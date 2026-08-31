```python
def _reset(self, new_base_lr=None, new_max_lr=None,
           new_step_size=None):
    """Resets cycle iterations.
    Optional boundary/step size adjustment.
    """
    if new_base_lr != None:
        self.base_lr = new_base_lr
    if new_max_lr != None:
        self.max_lr = new_max_lr
    if new_step_size != None:
        self.step_size = new_step_size
    self.clr_iterations = 0.
```