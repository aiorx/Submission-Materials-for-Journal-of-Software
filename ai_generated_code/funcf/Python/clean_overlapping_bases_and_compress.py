```python
def convert_index_to_consecutive_segment(idx_series, chrom):
	'''
	If input is pd.Series([1, 2, 3, 5, 6, 7, 10, 11, 15]), this function shoudl return 
	start  end
0      1    3
1      5    7
2     10   11
3     15   15
	Function was Drafted using common development resources and verified by Ha
	'''
	idx_series = pd.Series(idx_series)
	diffs = idx_series.diff() > 1
	# Step 2: Label groups
	group_labels = diffs.cumsum()
	# Step 3: Aggregate groups to find start and end
	grouped = idx_series.groupby(group_labels).agg(['min', 'max']).reset_index(drop=True)
	grouped.columns = ['start', 'end']		
	grouped['end'] = grouped['end'] + 1
	# because bedtools index is 0-based, half-open interval [start,end) while pandas series indexing is closed interval [start,end], this line is needed to convert the pandas series idx system to bedtools's idx system
	# this line is basically trying to convert from the pandas series indexing system to the bedtools indexing system
	grouped['chrom'] = chrom
	grouped = grouped[['chrom', 'start', 'end']]
	return grouped 
```