```python
def get_triplet_reader(input_data_path):
    return TripletReader(input_data_path,
                         s1_col_idx=0, 
                         s2_col_idx=1, 
                         s3_col_idx=2, 
                         delimiter='\t', 
                         quoting=csv.QUOTE_MINIMAL, 
                         has_header=True)
```