```python
def get_environ():
    """Returns the environment passed using OS environment variable"""
    return os.environ.get('ETL_PYSPARK_ENV')
```