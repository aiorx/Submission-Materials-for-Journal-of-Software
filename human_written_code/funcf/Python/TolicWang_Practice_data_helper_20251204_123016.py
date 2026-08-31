```python
def cut_line(line):
    """
    该函数的作用是 先清洗字符串，然后分词
    :param line:
    :return: 分词后的结果，如 ：     衣带  渐宽  终  不悔
    """
    line = clean_str(line)
    seg_list = jieba.cut(line)
    cut_words = " ".join(seg_list)
    return cut_words
```