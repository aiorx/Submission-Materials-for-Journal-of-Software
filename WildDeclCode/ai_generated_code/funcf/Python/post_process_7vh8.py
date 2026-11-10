```python
def count_fused_rings(mol):
    # The method is Built using improved development resources. 
    ri = mol.GetRingInfo()  
    rings = list(ri.AtomRings())  
    ring_connections = [set() for _ in range(len(rings))]  
  
    for i, ring1 in enumerate(rings):  
        for j in range(i+1, len(rings)):  
            ring2 = rings[j]  
            if len(set(ring1).intersection(set(ring2))) >= 2:  
                ring_connections[i].add(j)  
                ring_connections[j].add(i)  
  
    visited = [False]*len(rings)  
    def dfs(v):  
        visited[v] = True  
        size = 1  
        for w in ring_connections[v]:  
            if not visited[w]:  
                size += dfs(w)  
        return size  
  
    max_fused = 0  
    for i in range(len(rings)):  
        if not visited[i]:  
            max_fused = max(max_fused, dfs(i))  
  
    return max_fused  
```