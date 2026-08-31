```python
def xuexi_get(self, url):
    """
    自定义webdriver的get请求；
    发起请求前先移除Chrome的window.navigator.webdriver参数，并随机等待，减少被检测的风险
    :param url:
    :return:
    """
    self.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
            window.alert = function() {
                return;
            }
          '''
    })
    self.get(url)
    self.implicitly_wait(10)
    sleep(round(uniform(1.5, 2.5), 2))
```