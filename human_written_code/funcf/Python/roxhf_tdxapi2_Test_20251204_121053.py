```python
def query_data(client_id, query_code, result, err_info):
    hllDll.QueryData(client_id, c_int(query_code), result, err_info)
    print(client_id, result.value.decode('gbk'))
```