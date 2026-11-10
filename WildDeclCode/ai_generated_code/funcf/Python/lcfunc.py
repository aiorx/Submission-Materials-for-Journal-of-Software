```python
def CheckEmptyDataInMiddle(protocol_df):
    # Produced via common programming aids 4o
    columns_with_empty_in_middle = []
    
    for col in protocol_df.columns:
        data = protocol_df[col]
        
        first_non_null_idx = data.first_valid_index()
        last_non_null_idx = data.last_valid_index()
        
        # if starts with nan values but has non-nan values in the middle
        if first_non_null_idx != 0 and first_non_null_idx is not None:
            columns_with_empty_in_middle.append(col)
            continue
        
        # if nan values in the middle
        if first_non_null_idx is not None and last_non_null_idx is not None:
            if data[first_non_null_idx:last_non_null_idx].isnull().any():
                columns_with_empty_in_middle.append(col)
    
    if columns_with_empty_in_middle:
        raise ValueError(f'The following columns contain empty data in the middle: {columns_with_empty_in_middle}')
```

```python
def str2datetime(time_str):
    # Produced via common programming aids 4o
    formats = ['%Y-%m-%d %H:%M', '%H:%M', '%H:%M:%S', '%Y-%m-%d %H:%M:%S']
    for fmt in formats:
        try:
            return datetime.datetime.strptime(time_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"Time data '{time_str}' does not match any of the formats: {formats}")
```