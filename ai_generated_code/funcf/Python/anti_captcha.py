```python
async def solve(self, page_url: str, site_key: str) -> bool:
    # NOTE: Lorem ipsum code, Assisted using common GitHub development aids
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://api.anti-captcha.com/createTask",
            json={
                "clientKey": self.api_key,
                "task": {
                    "type": "NoCaptchaTaskProxyless",
                    "websiteURL": page_url,
                    "websiteKey": site_key,
                },
            },
        ) as resp:
            data = await resp.json()
            task_id = data["taskId"]

    while True:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anti-captcha.com/getTaskResult",
                json={"clientKey": self.api_key, "taskId": task_id},
            ) as resp:
                data = await resp.json()
                if data["status"] == "ready":
                    return True
                await asyncio.sleep(1)
```