```python
# 轮盘赌选择
def rand_choose(self, p):
    x = np.random.rand()
    for i, t in enumerate(p):
        x -= t
        if x <= 0:
            break
    return i
```