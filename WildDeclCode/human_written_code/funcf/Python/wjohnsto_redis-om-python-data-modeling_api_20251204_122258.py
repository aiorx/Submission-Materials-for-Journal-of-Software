```python
@router.get("/stores")
async def get_stores():
    return await Store.find().all()
```