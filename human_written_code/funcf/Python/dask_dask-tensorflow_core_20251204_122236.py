```python
def start_and_attach_server(spec, job_name=None, task_index=None, dask_worker=None):
    server = tf.train.Server(spec, job_name=job_name, task_index=task_index)
    dask_worker.tensorflow_server = server
    dask_worker.tensorflow_queue = Queue()
    return 'OK'
```