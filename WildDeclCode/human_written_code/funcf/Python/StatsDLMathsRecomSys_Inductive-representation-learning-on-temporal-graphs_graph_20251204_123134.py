```python
def init_off_set(self, adj_list):
    """
    Params
    ------
    adj_list: List[List[int]]
    
    """
    n_idx_l = []
    n_ts_l = []
    e_idx_l = []
    off_set_l = [0]
    for i in range(len(adj_list)):
        curr = adj_list[i]
        curr = sorted(curr, key=lambda x: x[1])
        n_idx_l.extend([x[0] for x in curr])
        e_idx_l.extend([x[1] for x in curr])
        n_ts_l.extend([x[2] for x in curr])
       
        
        off_set_l.append(len(n_idx_l))
    n_idx_l = np.array(n_idx_l)
    n_ts_l = np.array(n_ts_l)
    e_idx_l = np.array(e_idx_l)
    off_set_l = np.array(off_set_l)

    assert(len(n_idx_l) == len(n_ts_l))
    assert(off_set_l[-1] == len(n_ts_l))
    
    return n_idx_l, n_ts_l, e_idx_l, off_set_l
```