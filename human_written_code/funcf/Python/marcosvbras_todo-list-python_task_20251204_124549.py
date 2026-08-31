```python
def create(self, data):
    task = {
        'title': data.get('title'),
        'description': data.get('description'),
        'done': False
    }

    inserted_id = self.task_collection.insert_one(task).inserted_id
    task = self.task_collection.find_one({ '_id': ObjectId(inserted_id) })

    return self.to_json(task)
```