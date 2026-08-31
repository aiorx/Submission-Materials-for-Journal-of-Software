```python
def init_edge_list(self, edges):
    pos_out_edge_list = defaultdict(list)
    neg_out_edge_list = defaultdict(list)
    pos_in_edge_list = defaultdict(list)
    neg_in_edge_list = defaultdict(list)
    for edge in edges:
        x, y, z = edge
        if z > 0:
            pos_out_edge_list[x].append(y)
            pos_in_edge_list[y].append(x)
        elif z < 0:
            neg_out_edge_list[x].append(y)
            neg_in_edge_list[y].append(x)
    return pos_out_edge_list, neg_out_edge_list, pos_in_edge_list, neg_in_edge_list
```