```python
def checker(status,content):
	code = ""
	error = ""
	# --
	for service in services:
		values = services[service]
		for value in values:
			opt = services[service][value]
			if value == 'error':error = opt 
			if value == 'code':code = opt 
		# ---
		if re.search(code,str(status),re.I) and re.search(error,str(content),re.I):
			return service,error
	return None,None
```