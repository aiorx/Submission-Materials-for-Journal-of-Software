```python
def leakyReLu(x, alpha=0.2):
    """Leaky ReLU activation function.

    Args:
        x (tensor): input tensor
        alpha (float): slope of the function for x < 0

    Returns:
        (tensor): output tensor after applying leaky ReLU
    """
    return tf.maximum(alpha * x, x)
```