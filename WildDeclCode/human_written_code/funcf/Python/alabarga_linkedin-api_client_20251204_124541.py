```python
def _set_session_cookies(self, cookiejar):
    """
    Set cookies of the current session and save them to a file.
    """
    self.session.cookies = cookiejar
    self.session.headers["csrf-token"] = self.session.cookies["JSESSIONID"].strip('"')
    with open(settings.COOKIE_FILE_PATH, "wb") as f:
        pickle.dump(cookiejar, f)
```