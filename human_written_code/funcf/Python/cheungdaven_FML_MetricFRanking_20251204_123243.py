```python
def __init__(self ,sess,  num_users, num_items, learning_rate = 0.1, epoch=200, N = 100, batch_size=1024 * 3 ):
    self.lr = learning_rate
    self.epochs = epoch
    self.N = N
    self.num_users = num_users
    self.num_items = num_items
    self.batch_size = batch_size
    self.clip_norm = 1
    self.sess = sess
    self.beta =1.5#2.5#0.6#2.5#1.5
```