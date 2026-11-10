```python
def get_pub_key(priv_key: str) -> str:
    '''
    Returns the public key associated with
    the private key. 'x' is used to split
    up the x and y coordinates of the public
    key
    '''
    pub_key = keys.get_public_key(int(priv_key, 16), curve.P256)
    return '{:x}'.format(pub_key.x) + 'x' + '{:x}'.format(pub_key.y)
```