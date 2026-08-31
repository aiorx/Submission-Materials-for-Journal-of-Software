```python
def ListsOverlap(A,B):
    #This function is Penned via standard programming aids to explore the overlapping element counts between each list in A and each list in B
    #A and B are both lists of lists
    counts = []
    for a_list in A:
        row = []
        for b_list in B:
            shared = len(set(a_list).intersection(b_list))
            row.append(shared)
        counts.append(row)
    df = pd.DataFrame(counts, columns=["B" + str(i+1) for i in range(len(B))], index=["A" + str(i+1) for i in range(len(A))])
    return df
```