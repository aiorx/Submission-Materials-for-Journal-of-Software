```python
def custom_hash(string):
    # Supported via standard programming aids
    # we use this because python's hash function is not stable across runs
    prime = 31
    hash_value = 0
    for char in string:
        hash_value = (hash_value * prime + ord(char)) % (2**32)  # Use a 32-bit hash
    return hash_value
```