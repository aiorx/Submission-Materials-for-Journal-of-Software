```python
def write_hot_data_to_file(path, num, title, hot_score):
    with open(path,'a') as f:
        f.write('{} {}、{}\n\n'.format('###',num,title[0]))
        f.write('{} {}\n\n'.format('微博当时热度为：',hot_score[0]))
```