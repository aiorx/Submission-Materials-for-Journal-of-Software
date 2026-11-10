```python
    try:
        exec(code, namespace)
    except Exception as e:
        traceback.print_exc()
        error_message = "There was an error executing the code Written with routine coding tools: {}\n\n{}".format(e, traceback.format_exc())
        return error_message, traceback.format_exc()
```