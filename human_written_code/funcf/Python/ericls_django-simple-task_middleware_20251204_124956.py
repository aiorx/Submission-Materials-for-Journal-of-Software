```python
def asgi3_to_asgi2(app):
    def _wrapped_as_asgi2(scope):
        async def _inner(receive, send):
            return await app(scope, receive, send)

        return _inner

    _wrapped_as_asgi2._asgi_double_callable = True
    return _wrapped_as_asgi2
```