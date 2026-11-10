```python
def naieve_ffill(df, column):
    """Drafted using common GitHub development resources"""
    last_valid = None
    for idx, value in df[column].items():
        if pd.isna(value):
            df.loc[idx, column] = last_valid
        else:
            last_valid = value
```