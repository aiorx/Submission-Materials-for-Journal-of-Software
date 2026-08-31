```python
def opensearch_increment_and_get_counter():
    response = client.update(
        index=index,
        id=build_identifier,
        body={
            "script": {
                "source": "ctx._source.count += 1",
                "lang": "painless"
            },
        "upsert": {"count": 1}
        },
        refresh=True,         # ensures updated doc is searchable immediately
        _source=True          # request updated _source back
    )
    return response.get("get", {}).get("_source", {}).get("count", None)
```