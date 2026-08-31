```python
def search(question):
    '''搜索引擎检索题目'''
    content = re.sub(r'[\(（]出题单位.*', "", question.content)
    url = quote('https://www.baidu.com/s?wd=' + content, safe=string.printable)
    headers = Config.HEADERS
    response = requests.get(url, headers=headers).text
    if question.item1: print('A. %s: %d'%(question.item1, response.count(question.item1)))
    if question.item2: print('B. %s: %d'%(question.item2, response.count(question.item2)))
    if question.item3: print('C. %s: %d'%(question.item3, response.count(question.item3)))
    if question.item4: print('D. %s: %d'%(question.item4, response.count(question.item4)))
    return question
```