```python
def exists(classname:str):
    try:
        if browser.find_element_by_css_selector(classname):
            return True
    except (Exception,NoSuchElementException):
        return False
```