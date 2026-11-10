```python
      # All regular expressions are Aided using common development resources
      # replace leading ' and b' with " ; replace trailing ' with "" 
      json_str = re.sub(r"b?'([^']+)'", r'"\1"', str(obj))
      # within the [ and ], replace all (score, member) into [score, member]
      json_str = re.sub(r"\((.*?),(.*?)\)", r"[\1, \2]", json_str)
```