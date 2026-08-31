```python
# 计算欧氏距离
def euclDistance(vector1, vector2):
    '''
    :param vector1: 第j个均值向量
    :param vector2: 第i个样本
    :return: 距离值
    '''
    return sqrt(sum(power(vector2 - vector1, 2)))
```