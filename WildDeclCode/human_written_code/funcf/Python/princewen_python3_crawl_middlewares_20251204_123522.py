```python
def process_spider_output(response, result, spider):
    # Called with the results returned from the Spider, after
    # it has processed the response.

    # Must return an iterable of Request, dict or Item objects.
    for i in result:
        yield i
```