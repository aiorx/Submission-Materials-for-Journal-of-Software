```python
for core in cores:
    for task in tasks_instances:
        prob += assigned[(task["name"], core["name"])] <= unused[(core["name"])]
```