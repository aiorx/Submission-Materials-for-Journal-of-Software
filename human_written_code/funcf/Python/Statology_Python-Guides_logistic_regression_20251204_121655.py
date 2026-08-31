```python
def load_data(url):
    """
    Load data from a given URL and return a pandas DataFrame.
    """
    data = pd.read_csv(url)
    return data
```