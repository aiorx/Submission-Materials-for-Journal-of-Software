```python
def make_message(text, people1, people2):
    # prompt Crafted via basic programming aids
    content = "给定以下标签：['不确定', '夫妻', '父母', '兄弟姐妹', '上下级', '师生', '好友', '同学', " \
              "'合作', '同一个人', '情侣', '祖孙', '同门', '亲戚']，" \
              f"请在以下句子中分析并分类实体之间的关系：'{text}'" \
              f"在这个句子中，{people1}和{people2}之间的关系应该属于哪个标签？"
    return content
```