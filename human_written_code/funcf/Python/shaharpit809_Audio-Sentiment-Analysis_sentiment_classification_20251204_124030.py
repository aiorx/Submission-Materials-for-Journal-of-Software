```python
from copy import deepcopy

def prepare_one_hot_encode(labels):
    y = deepcopy(labels)
    for i in range(len(y)):
        y[i] = int(y[i])

    n_labels = len(y)
    n_unique_labels = len(np.unique(y))
    one_hot_encode = np.zeros((n_labels, n_unique_labels))
    f = np.arange(n_labels)
    for i in range(len(f)):
        one_hot_encode[f[i], y[i] - 1] = 1
    return one_hot_encode
```