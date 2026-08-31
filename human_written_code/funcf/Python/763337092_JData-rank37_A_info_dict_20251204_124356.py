```python
'''遍历字典num项'''
def ergodic_dict(dict, num=5):
    index = 0
    for key in dict:
        print key, dict[key]
        index += 1
        if index > num:
            break
    print 'length:', len(dict)
    print ' '
```