```python
def _number_of_clusters(self, element: Element):
    """
    get number of clusters like list
    :param element:
    :return:
    """
    tags = ['div', 'li', 'ul']
    return number_of_clusters(element, tags=tags)
```