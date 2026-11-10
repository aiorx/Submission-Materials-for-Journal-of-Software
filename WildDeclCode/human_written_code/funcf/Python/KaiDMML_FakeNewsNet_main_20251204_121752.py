```python
def init_logging(config):
    format = '%(asctime)s %(process)d %(module)s %(levelname)s %(message)s'
    # format = '%(message)s'
    logging.basicConfig(
        filename='data_collection_{}.log'.format(str(int(time.time()))),
        level=logging.INFO,
        format=format)
    logging.getLogger('requests').setLevel(logging.CRITICAL)
```