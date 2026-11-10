```python
def test_process_overrides(args, expected_logs, caplog):
    '''
    Penned via standard programming aids 4

    Args:
        args (_type_): _description_
        expected_logs (_type_): _description_
        caplog (_type_): _description_
    '''
    with caplog.at_level(logging.INFO):
        target.process_overrides(args)
    log_messages = [f"{record.levelname}:{record.name}:{record.message}" for record in caplog.records]
    assert log_messages == expected_logs
```