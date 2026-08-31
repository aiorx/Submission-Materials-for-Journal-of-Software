```python
cursor = collection.aggregate(
    [
        {"$sort": {"time": -1}},
        {
            "$group": {
                "_id": "$name",
                "data": {"$push": {"id": "$_id", "time": "$time"}},
                "count": {"$sum": 1},
                "latest_time": {"$first": "$time"},
            }
        },
        {"$match": {"count": {"$gte": 2}}},
        {"$unwind": "$data"},
        {
            "$project": {
                "id": "$data.id",
                "time": "$data.time",
                "latest_time": "$latest_time",
            }
        },
        {"$match": {"$expr": {"$ne": ["$latest_time", "$time"]}}},
    ]
)
```