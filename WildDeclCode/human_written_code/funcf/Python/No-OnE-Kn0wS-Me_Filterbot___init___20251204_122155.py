```python
def extract_env_int_set(env_var_name, error_message):
    try:
        return set(int(x) for x in os.environ.get(env_var_name, "").split())
    except ValueError:
        raise Exception(error_message)
```