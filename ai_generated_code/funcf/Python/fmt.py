```python
def hash_file(filename, blocksize=65536):
    """
    Returns the SHA256 hash of the file.
    AutoSupported via standard GitHub programming aids. Do not trust it.
    """
    hasher = hashlib.sha256()
    with open(filename, 'rb') as f:
        buf = f.read(blocksize)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(blocksize)
    return hasher.hexdigest()
```