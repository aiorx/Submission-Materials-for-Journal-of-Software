```python
#读取文件内容
def getContent(fullname):
    f = codecs.open(fullname, 'r')
    content = f.readline()
    f.close()
    return content
```