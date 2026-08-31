```python
def setting(self, label_num_per_class, test_num):
    '''Set label data and test set in semi-supervised learning

    Label data and test set should be settled at first. 

    '''
    self.test_ids = random.sample(range(self.n), test_num)
    remains = set(range(self.n)) - set(self.test_ids)
    num_of_class = [0] * self.m
    self.label_ids = []
    for i in remains:
        if num_of_class[self.label[i]] < label_num_per_class:
            self.label_ids.append(i)
        num_of_class[self.label[i]] += 1
    self.unlabel_ids = list(set(range(self.n)) - set(self.label_ids))
    self.test_num, self.label_num = test_num, sum(num_of_class)
```