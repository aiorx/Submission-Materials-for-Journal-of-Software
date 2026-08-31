```python
def union(self, u, v):
    pu = self.find(u)
    pv = self.find(v)
    if pu == pv:
        return False
    if self.rank[pu] > self.rank[pv]:
        self.parent[pv] = pu
    elif self.rank[pu] < self.rank[pv]:
        self.parent[pu] = pv
    else:
        self.rank[pv] += 1
        self.parent[pu] = pv
    return True
```