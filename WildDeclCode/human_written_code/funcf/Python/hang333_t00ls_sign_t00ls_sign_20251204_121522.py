```python
def get_password_hash(pswd, password_hash):
    if not password_hash:
        return hashlib.md5(pswd.encode('utf-8')).hexdigest()
    return pswd
```