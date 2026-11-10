```python
def print_status(ip, message):
    global print_lock

    with print_lock:
        print "[*] [%s] %s" % (ip, message)
```