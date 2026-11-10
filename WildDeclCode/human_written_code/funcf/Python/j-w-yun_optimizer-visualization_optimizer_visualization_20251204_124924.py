```python
# noisy hills of the cost function
def __f1(x, y):
    return -1 * tf.sin(x * x) * tf.cos(3 * y * y) * tf.exp(-(x * y) * (x * y)) - tf.exp(-(x + y) * (x + y))
```