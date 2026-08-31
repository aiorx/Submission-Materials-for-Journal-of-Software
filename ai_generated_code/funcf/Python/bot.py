```python
def critical_put(self, *values: Identifier):

    # Thanks ChatGPT!
    if len(values) == 0:
        raise ValueError("Players required")
    for value in values:
        if value.player is self:
            self._historie.append(value)
        if value.was == small:
            self._min = max(self._min, value.value)
        if value.was == big:
            self._max = min(self._max, value.value)

    for history in self._historie:
        if history.was == small:
            self._min = max(self._min, history.value)
        if history.was == big:
            self._max = min(self._max, history.value)

    # print(f"max = {self._max} | min = {self._min}")
```