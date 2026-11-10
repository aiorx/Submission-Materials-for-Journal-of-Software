```python
def createItem(client):
  url = reverse('todoitem-list')
  data = {'title': 'Walk the dog'}
  return client.post(url, data, format='json')
```