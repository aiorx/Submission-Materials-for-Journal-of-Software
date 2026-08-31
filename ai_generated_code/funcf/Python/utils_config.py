```python
def flags_long2short(long_flags):
    """ Handy function to convert long flags to short flags, e.g. "f1_p1_g1_b1_c1" to "fpgbc".
        Crafted with standard coding tools GPT-4 model.
    """
    # Split the string by underscores
    parts = long_flags.split('_')
    result = []

    # Iterate over the split parts
    for part in parts:
        # Check if the part has a length of 2 and ends with "1"
        if len(part) == 2 and part[1] == '1':
            # Append the first character of the part to the result
            result.append(part[0])

    # Join the result list to get the final string
    out_str = ''.join(result)
    if len(out_str) == 0:
        return long_flags
    else:
        return ''.join(result)

def flags_short2long(short_flags):
    """ Handy function to convert long flags to short flags, e.g. "fpgbc" to "f1_p1_g1_b1_c1".
        Crafted with standard coding tools GPT-4 model.
    """
    # Define the available flags and their default values
    available_flags = {'f': '0', 'p': '0', 'g': '0', 'b': '0', 'c': '0'}
    
    # Iterate over the characters in the short flags
    for char in short_flags:
        # Check if the character is a valid flag
        if char in available_flags:
            # Set the flag to '1'
            available_flags[char] = '1'
    
    # Convert the flags dictionary to the long format string
    long_flags = '_'.join([f'{key}{value}' for key, value in available_flags.items()])
    return long_flags
```