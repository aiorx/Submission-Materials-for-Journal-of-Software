```python
import json

def load_and_print_data(response_text):
    data = json.loads(response_text)['data']['list']
    for d in data:
        print(d['c'], d['custName'])
```