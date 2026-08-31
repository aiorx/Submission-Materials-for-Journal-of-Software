```python
def process_depth(dep):
    dep = dep - dep.min()
    dep = dep / dep.max()
    dep_vis = dep * 255

    return dep_vis.astype('uint8')
```