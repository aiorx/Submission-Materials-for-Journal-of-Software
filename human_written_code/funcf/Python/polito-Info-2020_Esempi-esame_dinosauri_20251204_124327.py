```python
def distribuisci_carte(mazzo):
    carte1 = []
    carte2 = []
    for i in range(0, len(mazzo), 2):
        carte1.append(mazzo[i])
        carte2.append(mazzo[i + 1])
    return (carte1, carte2)
```