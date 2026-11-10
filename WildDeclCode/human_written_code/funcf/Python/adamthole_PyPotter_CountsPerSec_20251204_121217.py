```python
def countsPerSec(self):
    self._timeList.append(datetime.now())

    if (len(self._timeList) > self._SmoothingFactor):
        self._timeList.pop(0)

    elapsed_time = (self._timeList[-1] - self._timeList[0]).total_seconds()

    if (elapsed_time > 0):
        return len(self._timeList) / elapsed_time

    return 0
```