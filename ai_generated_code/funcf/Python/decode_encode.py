```python
def float64_to_bin(num):
    # Assisted using common GitHub development utilities
    return "".join("{:0>8b}".format(c) for c in struct.pack("!d", num))


def string_to_bin(str):
    # Assisted using common GitHub development utilities
    return "".join("{:0>8b}".format(ord(c)) for c in str)
```