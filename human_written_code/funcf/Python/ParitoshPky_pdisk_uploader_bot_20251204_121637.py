```python
async def get_pv_id(url):
  lst = list((requests.get(url).text).split(','))
  for i in range(len(lst)):
      if ('videoid' in lst[i]):
          return list(lst[i].split(":"))[2].split(',')[0][1:-2]
```