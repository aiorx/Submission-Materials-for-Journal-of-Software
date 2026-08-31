```python
def remember(self, state, action, reward, next_state, done):
  self.memory.append((state, action, reward, next_state, done))
```