```python
def load_instance(n, i, num_targets):
    with open('new_budget_instances/yahoo_' + str(n) + '_' + str(i), 'rb') as f:
        Pfull, wfull = pickle.load(f, encoding='bytes')
    P = np.zeros((num_items, num_targets), dtype=np.float32)
    for i in range(num_targets):
        for j in Pfull[i]:
            P[j, i] = Pfull[i][j]
    P = torch.from_numpy(P).float()
    return P
```