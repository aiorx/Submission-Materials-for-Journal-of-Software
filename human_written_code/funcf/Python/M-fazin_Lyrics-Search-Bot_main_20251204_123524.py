```python
def search(song):
        r = requests.get(API + song)
        find = r.json()
        return find
```