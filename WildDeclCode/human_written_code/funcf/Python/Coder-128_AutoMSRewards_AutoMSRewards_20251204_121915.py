```python
def search(query):
    p.hotkey("ctrl","e")
    time.sleep(.1)
    p.write(query)
    p.press("enter")
    time.sleep(.67)
```