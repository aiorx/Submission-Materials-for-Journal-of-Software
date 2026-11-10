```python
def get_cookies_dict(browser):
    c = browser.get_cookies()
    cookies = {}
    for cookie in c:
        cookies[cookie['name']] = cookie['value']
    return cookies
```