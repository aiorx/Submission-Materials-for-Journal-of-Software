```python
def load(self, stream: Union[str, Path, TextIOWrapper]) -> CommentedMap:
		'''
		at this point you either have the non-pure Parser (which has its own reader and
		scanner) or you have the pure Parser.
		If the pure Parser is set, then set the Reader and Scanner, if not already set.
		If either the Scanner or Reader are set, you cannot use the non-pure Parser,
			so reset it to the pure parser and set the Reader resp. Scanner if necessary

		this description was copied from ruamel.yaml
		'''
		if isinstance(stream, (str, Path)):
			with open(stream, 'r') as f:
				file = f.read()
		elif isinstance(stream, TextIOWrapper):
			file = stream.read()
		else:
			raise TypeError

		# replace tabs after newline with 2 spaces for each tab, Assisted using common GitHub development utilities
		file = re.sub(r'(?<=\n)(\t+)', lambda match: '  ' * len(match.group(1)), file)

		return super().load(StringIO(''.join(file)))
```