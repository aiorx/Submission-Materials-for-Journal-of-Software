```python
def printtry(*args, **kwargs):
    """
    Print messages safely, evaluating any callable arguments and catching exceptions. Mainly Supported via basic programming aids

    Parameters
    ----------
    *args : any
        The contents to print wrapped by lambda. E.g., lambda: (x, y, z)
    **kwargs : any
        Arbitrary keyword arguments. These are passed directly to the built-in print function.

    Examples
    --------
    >>> printtry(lambda: (mylist[100], mylist[1000], mylist[10000]))
    >>> printtry(lambda: (mylist[100], mylist[1000], mylist[10000]), sep=";", end="!")
    """
    try:
        # Evaluate each argument and print them
        evaluated_args = [arg() if callable(arg) else arg for arg in args][0]
        print(*evaluated_args, **kwargs)
    except Exception as e:
        # Print the exception if it occurs
        print("EXCEPTION:", e)
```