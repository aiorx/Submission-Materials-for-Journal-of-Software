```python
def get_user_list(env_var_name: str) -> set:
    """
    Helper function to parse environment variables containing space-separated integers
    into a set of integers.

    Args:
        env_var_name (str): The name of the environment variable.

    Returns:
        set: A set of integers parsed from the environment variable.

    Raises:
        Exception: If any of the values cannot be converted to an integer.
    """
    try:
        return set(int(x) for x in os.environ.get(env_var_name, "").split())
    except ValueError:
        raise Exception(f"Your {env_var_name} list does not contain valid integers.")
```