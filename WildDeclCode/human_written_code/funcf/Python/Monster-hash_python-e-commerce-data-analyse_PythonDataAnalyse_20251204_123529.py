```python
def fill_missing_chanelID(df):
    # 1.查看chanelID空值
    df[df.chanelID.isnull()]
    # 2.对空值进行修补
    df['chanelID'].fillna(value=df.chanelID.mode()[0], inplace=True)
    return df
```