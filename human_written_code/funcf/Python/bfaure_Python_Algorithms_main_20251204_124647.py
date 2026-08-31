```python
from os.path import getsize
def print_file_bytes(filename):
    f = open(filename, 'r')
    for i in range(getsize(filename)):
        f.seek(i)
        print("Byte #%d:\t%s" % (i, f.read(1)))
    f.close()
```