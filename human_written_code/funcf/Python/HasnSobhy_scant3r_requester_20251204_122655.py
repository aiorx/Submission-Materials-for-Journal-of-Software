```python
def thetime():
	now = datetime.now()
	return f'{bold}{blue}[{end}{bold}{now.hour}:{now.minute}:{now.second}{blue}{bold}]{end}'
```