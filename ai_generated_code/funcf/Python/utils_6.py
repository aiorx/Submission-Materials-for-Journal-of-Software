```python
def to_snake_case(input_string: str) -> str:
    """
    Converts CamelCase strings into snake_case (Crafted with standard coding tools)
    :param input_string: String to convert
    :return: String converted to snake case
    """
    return "".join(["_" + c.lower() if c.isupper() else c for c in input_string]).lstrip("_")


def to_camel_case(input_string: str) -> str:
    """
    Converts snake_case strings into CamelCase (Crafted with standard coding tools)
    :param input_string: String to convert
    :return: String converted to CamelCase
    """
    words = input_string.split('_')
    return words[0] + ''.join(word.capitalize() for word in words[1:])
```