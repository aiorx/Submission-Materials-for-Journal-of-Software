```python
def create_tables(self):
    Base.metadata.create_all(self.engine)
    logging.info("create database tables")
```