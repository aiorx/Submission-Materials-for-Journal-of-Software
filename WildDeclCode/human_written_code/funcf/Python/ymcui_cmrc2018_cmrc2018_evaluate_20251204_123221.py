```python
def calc_f1_score(answers, prediction):
	f1_scores = []
	for ans in answers:
		ans_segs = mixed_segmentation(ans, rm_punc=True)
		prediction_segs = mixed_segmentation(prediction, rm_punc=True)
		lcs, lcs_len = find_lcs(ans_segs, prediction_segs)
		if lcs_len == 0:
			f1_scores.append(0)
			continue
		precision 	= 1.0*lcs_len/len(prediction_segs)
		recall 		= 1.0*lcs_len/len(ans_segs)
		f1 			= (2*precision*recall)/(precision+recall)
		f1_scores.append(f1)
	return max(f1_scores)
```