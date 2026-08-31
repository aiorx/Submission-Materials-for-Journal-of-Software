```python
def dump_cookie(self):
    cookie_file = Path(COOKIE_DIR, self.task_name)
    cookie = self.s.driver.get_cookies()
    print(cookie)
    # cookie = [c for c in cookie if self.bing_urls['domain'] in c.get('domain')]
    with open(cookie_file, mode='w') as fp:
        json.dump(cookie, fp)
```