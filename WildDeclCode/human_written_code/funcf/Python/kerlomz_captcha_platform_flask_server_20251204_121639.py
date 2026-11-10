```python
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response
```