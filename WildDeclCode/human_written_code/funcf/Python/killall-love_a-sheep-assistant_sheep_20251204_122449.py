```python
def get_user_info(session, uid):
    res = session.get(
        url=f"https://cat-match.easygame2021.com/sheep/v1/game/user_info?uid={uid}&t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQ0NzgwMTAsIm5iZiI6MTY2MzM3NTgxMCwiaWF0IjoxNjYzMzc0MDEwLCJqdGkiOiJDTTpjYXRfbWF0Y2g6bHQxMjM0NTYiLCJvcGVuX2lkIjoiIiwidWlkIjo0ODUwNDY1MCwiZGVidWciOiIiLCJsYW5nIjoiIn0.IEjNoHJiJPqlh86DqDS3-SMTwErTCatQF6ykZk4o-Yc", verify=False).json()
    return res['data']['wx_open_id']
```