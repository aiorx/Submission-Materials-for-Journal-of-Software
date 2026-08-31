```python
def sign(x,w):
    if np.dot(x,w)[0] >= 0:
        return 1
    else:
        return -1
```