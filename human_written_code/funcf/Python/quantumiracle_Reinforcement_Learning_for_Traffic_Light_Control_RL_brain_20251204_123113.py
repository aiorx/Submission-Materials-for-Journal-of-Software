```python
def store_transition(self, s, a, r, s_):
    if not hasattr(self, 'memory_counter'):
        self.memory_counter = 0
    transition = np.hstack((s, [a, r], s_))
    # replace the old memory with new memory
    index = self.memory_counter % self.memory_size
    self.memory[index, :] = transition
    self.memory_counter += 1
```