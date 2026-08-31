```python
def get_random_block_from_data(data, batch_size):
    start_index = np.random.randint(0, len(data) - batch_size)  # 随机获取区块
    return data[start_index:(start_index + batch_size)]  # batch_size大小的区块
```