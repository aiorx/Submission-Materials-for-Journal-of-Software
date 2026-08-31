```python
def match_location(self, url):
    """

    :param url: 未location的url
    :return: 真实url
    """
    resp = self.head(url=url, check=False, allow_redirects=False)
    if not resp:
        return set()
    location = resp.headers.get('location')
    if not location:
        return set()
    return location
```