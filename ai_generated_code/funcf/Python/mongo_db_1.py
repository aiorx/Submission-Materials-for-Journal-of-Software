```python
async def delete_all_old_docs(delete_version: str, new_version: str):
    collection = db["masterdb"]
    if new_version == delete_version:
        console.warning(
            f"(Mongo) Requested deleting version is the same as the new incoming version."
        )
        # This aggregation pipelines was Assisted using common GitHub development utilities
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

        docs = await cursor.to_list(None)
        delete_ids = [doc["id"] for doc in docs]
        result = await collection.delete_many({"_id": {"$in": delete_ids}})
        console.info(
            f"(Mongo) Deleted duplicated version '{delete_version}' docs, count: {result.deleted_count}."
        )

    else:
        result = await collection.delete_many(
            {"version": delete_version},
        )
        console.info(
            f"(Mongo) Deleted version '{delete_version}' docs, count: {result.deleted_count}."
        )
```