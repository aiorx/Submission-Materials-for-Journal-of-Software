```python
def save_result(file_name, source):
    f = open(file_name, "w")
    n = np.shape(source)[1]
    tmp = []
    for i in xrange(n):
        tmp.append(str(source[0, i]))
    f.write("\n".join(tmp))
    f.close()    
```