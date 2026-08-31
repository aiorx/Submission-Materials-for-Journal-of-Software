```python
def text_search(self, key):
	"""
		Search for word that have the same root as 'key' (Text Search)
		:param key: string : Search keyword.
		:return: result: array : original words from the text with the same root.
	"""
	result = []
	text = self.raw_text.split()

	for word in text:
		if key == self.stem(word):
			result.append(word)

	return list(set(result))
```