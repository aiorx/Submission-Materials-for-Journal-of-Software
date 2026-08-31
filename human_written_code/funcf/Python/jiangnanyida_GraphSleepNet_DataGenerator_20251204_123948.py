```python
def getFold(self, i):
    isFirst=True
    for p in range(self.k): 
        if p!=i:
            if isFirst:
                train_data       = self.x_list[p]
                train_targets    = self.y_list[p]
                isFirst = False
            else:
                train_data      = np.concatenate((train_data, self.x_list[p]))
                train_targets   = np.concatenate((train_targets, self.y_list[p]))
        else:
            val_data    = self.x_list[p]
            val_targets = self.y_list[p]
    return train_data,train_targets,val_data,val_targets
```