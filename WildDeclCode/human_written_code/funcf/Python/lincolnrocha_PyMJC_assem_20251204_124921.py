```python
def nth_temp(self, temp_list: temp.TempList, i: int) -> temp.Temp:
    if i == 0:
        return temp_list.head
    else:
        return self.nth_temp(temp_list.tail, i - 1)
```