```python
def extractCapitals(s: str):
    # extractCapitals was coded entirely by ChatGPT
    
    # Extract all uppercase letters
    capitals = ''.join([char for char in s if char.isupper()])
    
    # Find the trailing lowercase-only segment (after last uppercase)
    last_upper_index = -1
    for i in range(len(s) - 1, -1, -1):
        if s[i].isupper():
            last_upper_index = i
            break
    
    # If no uppercase found, return empty capitals + full string
    tail = s[last_upper_index + 1:]
    
    return capitals + tail
```