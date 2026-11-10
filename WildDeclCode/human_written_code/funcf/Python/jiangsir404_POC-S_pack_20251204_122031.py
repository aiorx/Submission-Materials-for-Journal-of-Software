```python
def check(email, key):
    if email and key:
        auth_url = "https://fofa.so/api/v1/info/my?email={0}&key={1}".format(email, key)
        try:
            response = urllib.urlopen(auth_url)
            if response.code == 200:
                return True
        except Exception, e:
            # logger.error(e)
            return False
    return False
```