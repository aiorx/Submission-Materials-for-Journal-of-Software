```python
def _gini(self, y):
    """Compute Gini impurity of a non-empty node.

    Gini impurity is defined as Σ p(1-p) over all classes, with p the frequency of a
    class within the node. Since Σ p = 1, this is equivalent to 1 - Σ p^2.
    """
    m = y.size
    return 1.0 - sum((np.sum(y == c) / m) ** 2 for c in range(self.n_classes_))
```