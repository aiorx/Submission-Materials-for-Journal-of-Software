```python
@app.route('/', methods=['GET'])
def home():
    return "<h1>Welcome to Intellipaat Demo</h1><p>This site is a prototype API for moving data between sources. Use /migrate to start the job.</p>"
```