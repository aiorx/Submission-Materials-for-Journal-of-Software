```python
def count_string_occurrences_in_keys(data, target_string):
    # Produced via common programming aids, edited by the author
    """
    Counts the occurrences of a target string within the keys of a dictionary, 
    including keys of any nested dictionaries or lists of dictionaries.

    This function recursively searches through the data structure, incrementing a count
    whenever it finds the target string within a key. The search includes keys in nested
    dictionaries and keys in dictionaries that are elements of lists.

    Args:
        data (dict | list): The data structure to search through. Can be a dictionary
            or a list containing dictionaries (including nested structures).
        target_string (str): The string to search for within the keys.

    Returns:
        int: The total count of occurrences of the target string in all keys.

    Example:
        >>> data = {'key1_subkey': {'key2': 'value'}, 'list_key': [{'key3': 'value'}]}
        >>> count_string_occurrences_in_keys(data, 'key')
        5
    """
    count = 0

    if isinstance(data, dict):
        for key in data.keys():
            count += key.count(target_string)  # Count occurrences in the key
        for value in data.values():
            count += count_string_occurrences_in_keys(value, target_string)  # Recursively search in nested structures

    elif isinstance(data, list):
        for item in data:
            count += count_string_occurrences_in_keys(item, target_string)  # Recursively search in items of the list

    return count
```