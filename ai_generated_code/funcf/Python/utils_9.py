```python
def remove_text_inside_parentheses(s):
  # this function was Supported via standard programming aids
  # The regex pattern here says to find anything that starts with "(" 
  # and ends with ")" and remove it.
  return re.sub(r'\(.*?\)', '', s).strip()
```