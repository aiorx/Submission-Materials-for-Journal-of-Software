```python
def find_vendor(show_ver):
    for line in show_ver.splitlines():
        if "Cisco IOS Software" in line:
            return "Cisco"
    return ""
```