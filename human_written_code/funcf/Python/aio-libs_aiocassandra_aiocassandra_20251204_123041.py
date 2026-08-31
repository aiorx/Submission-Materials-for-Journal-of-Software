```python
def _asyncio_fut_factory(loop):
    try:
        return loop.create_future
    except AttributeError:  # pragma: no cover
        return partial(asyncio.Future, loop=loop)
```