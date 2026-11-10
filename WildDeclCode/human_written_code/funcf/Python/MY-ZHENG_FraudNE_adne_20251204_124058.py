```python
def user_encoder(X_u):
	for i in range(self.layers-1):
		name="user_encoder"+str(i)
		print name
		X_u=tf.nn.sigmoid(tf.matmul(X_u,self.Wu[name]) + self.bu[name])
	return X_u
```