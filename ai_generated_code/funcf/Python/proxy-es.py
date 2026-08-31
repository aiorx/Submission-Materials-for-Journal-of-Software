```python
async def split_jsons(self, json_string):
    json_objects = []
    depth = 0
    start_index = 0
    for i, char in enumerate(json_string):
        if char == '{':
            if depth == 0:
                start_index = i
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                end_index = i + 1
                try:
                    json_obj = json.loads(json_string[start_index:end_index])
                    json_objects.append(json_obj)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON: {e}")
    return json_objects
```