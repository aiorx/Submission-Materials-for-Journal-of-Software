```python
def setup(self):
    with open('/home/poppy/dev/puppet-master/handshake_1.record') as f:
        self.h1 = Move.load(f)

    with open('/home/poppy/dev/puppet-master/handshake_2.record') as f:
        self.h2 = Move.load(f)
```