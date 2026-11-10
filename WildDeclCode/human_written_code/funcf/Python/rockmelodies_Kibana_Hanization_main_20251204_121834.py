```python
def checkFile(self, file, whitelist):
    if whitelist == []:
        return True
    ext = os.path.splitext(file)[1]
    if ext.strip('.') in whitelist:
        return True
    else:
        return False
```