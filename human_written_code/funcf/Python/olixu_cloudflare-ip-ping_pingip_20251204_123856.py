```python
# 设置日志
def set_logging_format():
    logging.basicConfig(level=logging.INFO,
        format='%(message)s',
        filename="ping_host.log",
        filemode='w'
    )
    console = logging.StreamHandler()
    console.setLevel(logging.FATAL)
    formatter = logging.Formatter('%(message)s')
    console.setFormatter(formatter)
    logging.getLogger('').addHandler(console)
```