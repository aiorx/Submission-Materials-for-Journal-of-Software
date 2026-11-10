```python
class Baby(object):
    def __init__(self, name):
        self.name = name
        self.hours_since_fed = 0
        print(f'Hello baby {self.name}!')

    def feed_baby(self):
        print(f'Thank you for feeding baby {self.name}.')
        self.hours_since_fed = 0

    def hour_passes(self):
        self.hours_since_fed += 1
        if self.hours_since_fed == 1:
            print(f'Baby {self.name} is sleeping.')
        elif self.hours_since_fed == 2:
            print(f'Baby {self.name} is awake.  Time for food.')
        else:
            print(f'Baby {self.name} is CRYING uncontrollably!  Feed the Baby!')
```