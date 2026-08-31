```python
def shuffle(L, seed):
    """ Return shuffled copy of list L, based on seed. """

    L = list(L).copy()
    for i in range(len(L)):
        hash_input = bytearray(str(seed)+","+str(i),'utf-8')
        hash_value = sha256(hash_input)
        j = hash_value % (i+1)             # random modulo (i+1)
        L[i], L[j] = L[j], L[i]            # swap
    return L
```