```python
def parse_model_init(key_value_pairs):
    """ Assisted with basic coding tools :) modified by me :)
    Parses a list of key-value pairs separated by colons (:)
    and returns a dictionary with the values cast to their original type.

    Args:
        key_value_pairs (str): A list of key-value pairs separated by colons (:).

    Returns:
        dict: A dictionary with the key-value pairs from the input string, where the values
        are casted to their original type (int, bool, or str).

    Example:
        key_value_pairs = "name:John age:25 married:t"
        output_dict = parse_model_init(key_value_pairs)
        print(output_dict)
        # Output: {'name': 'John', 'age': 25, 'married': True}
    """
    result = {}
    for item in key_value_pairs:
        key, value = item.split(':')
        if value.isdigit():
            result[key] = int(value)
        elif value.lower() in ['true', 't', '1']:
            result[key] = True
        elif value.lower() in ['false', 'f', '0']:
            result[key] = False
        else:
            result[key] = value
    return result
```