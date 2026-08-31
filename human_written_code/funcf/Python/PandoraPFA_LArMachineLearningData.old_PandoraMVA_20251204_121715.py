```python
def Randomize(X, Y, setSameSeed=False):
    if setSameSeed:
        np.random.seed(0)

    order = np.random.permutation(Y.size)
    return X[order], Y[order]
```