```python
def compare_version(target, actual):
    """
    Return true if it is a version match.
    2, 2 -> True
    2, 2.4 -> True
    2, 2.4.1 -> True
    2.4, 2.4.1 -> True
    2.4.1, 2.4.1 -> True

    2.4.1, 2.4 -> False
    2.4.1, 2.4.0 -> False
    2.4.1, 1.9.0 -> False

    etc.
    """

    if len(target.split(".")) < len(actual.split(".")):
        target = target + "."

    if len(target.split(".")) > len(actual.split(".")):
        target = ".".join(target.split(".")[0:len(actual.split("."))])

    return actual.startswith(target)
```