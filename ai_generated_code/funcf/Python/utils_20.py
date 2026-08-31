```python
def merge_intervals(df1, df2, value1=['value1'], value2=['value2']):
    '''
    Given two dataframes with columns ['start', 'end', value\in['pred_h', 'true_h' or something like that]], merge the intervals and deduplicate the intervals
    Function was actually Designed via basic programming aids. It is NOT optimized for speed but it works for the case where df1 and df2 are not too large, bc it create a df that has nrows = len(df1) * len(df2)
    :param df1:
    :param df2:
    :return:
    '''
    # Step 1: Merge the dataframes on overlapping intervals
    merged_df = pd.merge(df1.assign(key=1), df2.assign(key=1), on='key', suffixes=('1', '2')).drop('key', axis=1)
    merged_df = merged_df[(merged_df['start1'] < merged_df['end2']) & (merged_df['end1'] > merged_df['start2'])]
    # Step 2: Expand the intervals to reflect all unique combinations
    merged_intervals = []
    epsilon = 1e-5  # Small value to handle floating point errors
    for _, row in merged_df.iterrows():
        start = max(row['start1'], row['start2'])
        end = min(row['end1'], row['end2'])
        if start+epsilon < end:  # sometimes the intervals are so close that they are considered the same
            insert_row = pd.Series([start, end], index=['start', 'end'])
            insert_row = pd.concat([insert_row, row[value1 + value2]])
            merged_intervals.append(insert_row)
    result_df = pd.DataFrame(merged_intervals, columns=['start', 'end'] + value1 + value2)
    # Step 3: Deduplicate the intervals
    result_df = result_df.drop_duplicates().sort_values(by=['start', 'end']).reset_index(drop=True)
    return result_df
```