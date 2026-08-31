```python
def exist_branch(name: str) -> bool:
    for info in fetch_infos:
        if name in info.name:
            return True
    return False
```