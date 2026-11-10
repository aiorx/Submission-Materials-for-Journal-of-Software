```python
def word_ixs_to_str(word_ixs, is_title):
	result_txt = ""
	for w_ix in word_ixs:
		w = (title_words if is_title else comment_words)[w_ix]
		if len(result_txt) == 0 or w in ['.', ',', "'", '!', '?', ':', ';', '...']:
			result_txt += w
		elif len(result_txt) > 0 and result_txt[-1] == "'" and w in ['s', 're', 't', 'll', 've', 'd']:
			result_txt += w
		else:
			result_txt += ' ' + w
	if len(result_txt) > 0:
		result_txt = result_txt[:1].upper() + result_txt[1:]
	return result_txt
```