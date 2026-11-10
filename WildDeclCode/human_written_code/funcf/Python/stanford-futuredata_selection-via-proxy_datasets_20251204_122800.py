```python
def load_data(self, path):
    df = pd.read_csv(path, header=None, keep_default_na=False,
                     names=self.columns)
    labels = (df[self.columns[0]] - df[self.columns[0]].min()).values
    if len(self.columns) > 2:
        data = (df[self.columns[1]]
                .str
                .cat([df[col] for col in self.columns[2:]], sep=" ")
                .values)
    else:
        data = df[self.columns[1]].values
    return data, labels
```