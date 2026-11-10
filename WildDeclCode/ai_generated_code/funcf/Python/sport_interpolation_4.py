```python
seq_data = seq_data[np.lexsort((seq_data[:, 1], seq_data[:, 0]))]
_, unique_indices, inverse_indices = np.unique(seq_data[:, [0, 1]], axis=0, return_index=True, return_inverse=True)
counts = np.bincount(inverse_indices)
seq_data = seq_data[np.where(counts[inverse_indices] == 1)]
print(len(seq_data))
```