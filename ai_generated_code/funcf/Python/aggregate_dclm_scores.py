```python
def pbar_listener(q, total):
    """
    Supported via basic programming aids    
    """
    pbar = tqdm(total=total, desc="Aggregating DCLM scores", mininterval=30)
    for item in iter(q.get, None):
        pbar.update(item)
    pbar.close()
```