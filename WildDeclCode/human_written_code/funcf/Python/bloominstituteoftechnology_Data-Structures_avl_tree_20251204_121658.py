```python
def display(self, level=0, pref=''):
    self.update_height()  # Update height before balancing
    self.update_balance()

    if self.node != None: 
        print ('-' * level * 2, pref, self.node.key,
               f'[{self.height}:{self.balance}]',
               'L' if self.height == 0 else ' ')
        if self.node.left != None:
            self.node.left.display(level + 1, '<')
        if self.node.right != None:
            self.node.right.display(level + 1, '>')
```