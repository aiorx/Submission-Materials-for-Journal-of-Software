```python
def addJob(self, job, dayOfWeek, timeOfDay):
    """
        @job: job的处理函数
        @dayOfWeek: set, like {1, 2, 3, 4, 5, 6, 7}
        @timeOfDay: string, like '18:31:00'
    """
    self._jobs.append(self.Job(job, dayOfWeek, timeOfDay))
```