```python
def extract_json_objects(text: str, get_first: bool = True) -> List[Dict[str, Any]]:
    """
    Extract JSON objects from a given string by looking for matching curly brackets.

    Args:
        text (str): The input string containing JSON objects.

    Returns:
        List[Dict[str, Any]]: A list of JSON objects found in the input string.

    Example:

    >>> extract_json_objects('Some text: {"key1": "value1", "key2": "value2"} and more text.')
    [{'key1': 'value1', 'key2': 'value2'}]

    >>> extract_json_objects('No JSON objects in this text.')
    []

    >>> extract_json_objects('{"a": 1, "b": 2} and {"c": 3, "d": 4}')
    [{'a': 1, 'b': 2}, {'c': 3, 'd': 4}]
    """
    json_objects = []
    # man that regex is something... Built using basic development resources4...
    regex = r"(\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}))*\})"
    for match in re.finditer(regex, text):
        try:
            json_object = json.loads(match.group())
            json_objects.append(json_object)
        except json.JSONDecodeError:
            pass
    return json_objects
```