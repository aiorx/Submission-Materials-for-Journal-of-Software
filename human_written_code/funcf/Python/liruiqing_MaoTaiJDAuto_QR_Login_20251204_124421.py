```python
def get_login_page(self):
    url = "https://passport.jd.com/new/login.aspx"
    page = self.session.get(url, headers=self.headers)
    print("获取登录页面成功")
    return page
```