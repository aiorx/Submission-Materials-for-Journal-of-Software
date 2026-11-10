```python
def get_db_config():
    return {
        'host':  os.environ.get('POSTGRES_SERVICE_HOST', 'localhost'),
        'user': os.environ.get('POSTGRES_SERVICE_USER', 'postgres'),
        'password': os.environ.get('POSTGRES_SERVICE_PASSWORD', None),
        'port': os.environ.get('POSTGRES_SERVICE_PORT', 5432),
        'database': os.environ.get('POSTGRES_SERVICE_DB_NAME', 'postgres')
    }
```