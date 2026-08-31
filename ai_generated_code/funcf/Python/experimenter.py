```python
def print_nicely(obj, n=3):
    """Prints a nested object nicely. Composed with routine coding tools"""
    import pprint, builtins
    if isinstance(obj, str): return builtins.print(obj)
    def _p(o):
        if isinstance(o, np.ndarray): return _p(o.tolist())
        if isinstance(o, (list, tuple)):
            o = [_p(x) for x in o]
            return o if len(o) <= 2*n+3 else o[:n] + ['...'] + o[-n:]
        if isinstance(o, dict): return {k: _p(v) for k, v in o.items()}
        return o
    pprint.pp(_p(obj), sort_dicts=False)
```