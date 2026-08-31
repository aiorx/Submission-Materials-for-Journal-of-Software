```python
@staticmethod
async def check_response(response: ClientResponse) -> None:
    """ Check the response returned by the TaHoma API"""
    if response.status in [200, 204]:
        return
    if response.status == 404:
        raise Exception(response.url, response.reason)

    try:
        result = await response.json(content_type=None)
    except JSONDecodeError:
        result = await response.text()
    if not result:
        print("none")
    message = None
    if result.get("errorCode"):
        message = result.get("error")

    raise Exception(message if message else result)
```