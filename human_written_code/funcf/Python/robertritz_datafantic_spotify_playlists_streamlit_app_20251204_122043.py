```python
def get_playlist_name(year_range):
    if (int(year_range[0]) - int(year_range[1])) == 0:
        return f"Top US Singles: {year_range[0]}"
    else:
        return f"Top US Singles: {year_range[0]}-{year_range[1]}"
```