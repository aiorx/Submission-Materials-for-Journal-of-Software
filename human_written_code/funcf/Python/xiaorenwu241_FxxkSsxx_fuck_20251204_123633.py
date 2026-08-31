```python
def BuildHeader(token):
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-GB,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Connection': 'keep-alive',
        'DNT': '1',
        'Host': 'ssxx.univs.cn',
        'Referer': 'http://ssxx.univs.cn/client/exam/5f71e934bcdbf3a8c3ba5061/1/1/5f71e934bcdbf3a8c3ba51d5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
        'Authorization': 'Bearer ' + token,
    }

    return headers
```