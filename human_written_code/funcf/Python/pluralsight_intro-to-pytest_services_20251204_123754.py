```python
def db_service(query_parameters):
    """
    A fake DB service that takes a remarkably long time to yield results
    """
    print("(Doing expensive database stuff!)")

    time.sleep(5.0)

    data = [FakeRow(0, "Foo", 19.95), FakeRow(1, "Bar", 1.99), FakeRow(2, "Baz", 9.99)]

    print("(Done doing expensive database stuff)")
    return data
```