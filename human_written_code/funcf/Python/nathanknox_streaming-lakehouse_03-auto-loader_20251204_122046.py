```python
def load_gym_logs():
    (spark.readStream.format("cloudFiles")
        .option("cloudFiles.format", "json")
        .schema(schema)
        .load(raw)
        .writeStream
        .format("delta")
        .option("checkpointLocation", gymMacLogsCheckpoint)
        .trigger(once=True)
        .start(gymMacLogs)
        .awaitTermination())
```