```python
async def _do_options_request(self):
    await self._do_request('options', "https://public-ubiservices.ubi.com/v3/profiles/sessions", headers={
        "Origin": "https://connect.ubisoft.com",
        "Referer": "https://connect.ubisoft.com/login?appId=314d4fef-e568-454a-ae06-43e3bece12a6",
        "User-Agent": CHROME_USERAGENT,
    })
```