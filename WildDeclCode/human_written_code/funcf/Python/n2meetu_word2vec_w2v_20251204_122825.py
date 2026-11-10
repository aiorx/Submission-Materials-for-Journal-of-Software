```python
def clearSen(comment):
    comment = comment.strip(' ')
    comment = comment.replace('、','')
    comment = comment.replace('~','。')
    comment = comment.replace('～','')
    comment = comment.replace('{"error_message": "EMPTY SENTENCE"}','')
    comment = comment.replace('…','')
    comment = comment.replace('\r', '')
    comment = comment.replace('\t', ' ')
    comment = comment.replace('\f', ' ')
    comment = comment.replace('/', '')
    comment = comment.replace('、', ' ')
    comment = comment.replace('/', '')
    comment = comment.replace(' ', '')
    comment = comment.replace(' ', '')
    comment = comment.replace('_', '')
    comment = comment.replace('?', ' ')
    comment = comment.replace('？', ' ')
    comment = comment.replace('了', '')
    comment = comment.replace('➕', '')
    return comment
```