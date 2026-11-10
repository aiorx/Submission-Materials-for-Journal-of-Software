```python
def caculate_HMS(now_second_p):
    global second, minute, hour
    second += now_second_p
    while second > 59:
        second -= 60
        minute += 1
    while minute > 59:
        minute -= 60
        hour += 1
    while hour > 23:
        hour -= 24
```