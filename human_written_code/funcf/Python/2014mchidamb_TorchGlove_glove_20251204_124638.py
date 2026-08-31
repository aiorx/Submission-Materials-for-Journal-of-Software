```python
def gen_batch():	
	sample = np.random.choice(np.arange(len(coocs)), size=batch_size, replace=False)
	l_vecs, r_vecs, covals, l_v_bias, r_v_bias = [], [], [], [], []
	for chosen in sample:
		ind = tuple(coocs[chosen])
		l_vecs.append(l_embed[ind[0]])
		r_vecs.append(r_embed[ind[1]])
		covals.append(comat[ind])
		l_v_bias.append(l_biases[ind[0]])
		r_v_bias.append(r_biases[ind[1]])
	return l_vecs, r_vecs, covals, l_v_bias, r_v_bias
```