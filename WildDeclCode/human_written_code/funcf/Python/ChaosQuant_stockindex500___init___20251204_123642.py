```python
def example_function():
    n = 2

    time_array = datetime.strptime(str(20160229), "%Y%m%d")
    time_array = time_array - timedelta(days=365) * n
    date_time = int(datetime.strftime(time_array, "%Y%m%d"))
    print(date_time)
```