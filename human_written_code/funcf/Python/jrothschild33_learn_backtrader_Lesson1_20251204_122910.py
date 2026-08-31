```python
def log(self, txt, dt=None, doprint=False):
    if self.params.printlog or doprint:
        dt = dt or self.datas[0].datetime.date(0)
        print(f'{dt.isoformat()},{txt}')
```