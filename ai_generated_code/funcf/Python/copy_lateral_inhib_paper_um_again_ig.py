```python
def find_input_means():
	#this was Drafted using common development resources, consult for debug
	# Create an array to store the mean inputs
	input_means = np.full(num_neurons, beta)  # Default to beta if no inputs exist

	# Extract indices for postsynaptic and presynaptic neurons
	post_syn_indices = idx_pairs[:, 1]
	pre_syn_indices = idx_pairs[:, 0]

	# Group by postsynaptic index to compute the mean
	for post_syn_idx in np.unique(post_syn_indices):
		mask = post_syn_indices == post_syn_idx
		pre_indices = pre_syn_indices[mask]

		if pre_indices.size > 0:
			mean = np.mean(synapses[post_syn_idx, pre_indices])
			input_means[post_syn_idx] = mean

	return input_means
```