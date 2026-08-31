```python
def proxy_test(self):
    try:
        req = urllib.request.Request('https://www.google.com', data=None, headers=self.__headers)
        urllib.request.urlopen(req, timeout=self.__time_out_limit).read().decode('utf-8')
    except:
        return False
    else:
        return True
```