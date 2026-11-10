```python
def output(self):
    Car.car_count += 1
    return "{} {} {} {}".format(self.mark, self._year, self.__price, Car.car_count)
```