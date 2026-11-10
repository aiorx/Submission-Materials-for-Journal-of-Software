```python
try:
    long_desc = open("README.md").read()
except IOError:
    long_desc = "Failed to read README.md"
```