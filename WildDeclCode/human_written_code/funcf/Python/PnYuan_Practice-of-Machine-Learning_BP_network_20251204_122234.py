```python
def Pred(self, x):
    '''
    predict process through the network
    @param x: the input array for input layer
    '''
    
    # activate input layer
    for i in range(self.i_n):
        self.i_v[i] = x[i]
        
    # activate hidden layer
    for h in range(self.h_n):
        total = 0.0
        for i in range(self.i_n):
            total += self.i_v[i] * self.ih_w[i][h]
        self.h_v[h] = self.af(total - self.h_t[h])
        
    # activate output layer
    for j in range(self.o_n):
        total = 0.0
        for h in range(self.h_n):
            total += self.h_v[h] * self.ho_w[h][j]
        self.o_v[j] = self.af(total - self.o_t[j])
```