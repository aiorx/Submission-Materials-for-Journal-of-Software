```python
def process_item(self, item, spider):
    '''先判断itme类型，在放入相应数据库'''
    if isinstance(item,DangdangItem):
        try:
            book_info = dict(item)  #
            if self.post.insert(book_info):
                print('ssssss')
        except Exception:
            pass
    # elif isinstance(item,PicItem):
    #     pass
        # try:
        #     PicItem   #
        # except Exception:
        #     pass
    return item
```