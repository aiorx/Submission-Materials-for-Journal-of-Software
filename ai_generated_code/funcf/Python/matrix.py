```python
def ith_combination(pool, r, index):
    # Function Drafted using common development resources
    """
    Compute the index-th combination (0-based) in lexicographic order
    without generating all previous combinations.
    """
    n = len(pool)
    combination = []
    elements_left = n
    k = r
    start = 0
    
    for i in range(r):
        # Find the largest value for the first element in the combination
        # that allows completing the remaining k-1 elements
        for j in range(start, elements_left):
            count = math.comb(elements_left - j - 1, k - 1)
            if index < count:
                combination.append(pool[j])
                k -= 1
                start = j + 1
                break
            index -= count
    
    return tuple(combination)
```