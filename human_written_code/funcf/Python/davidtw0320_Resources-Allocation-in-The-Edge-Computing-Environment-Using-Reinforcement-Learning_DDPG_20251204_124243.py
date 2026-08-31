```python
def choose_action(self, s):
    return self.sess.run(self.a, {self.S: s[np.newaxis, :]})[0]
```