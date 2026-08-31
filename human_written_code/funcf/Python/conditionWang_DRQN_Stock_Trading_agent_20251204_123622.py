```python
def act(self, state):
	if not self.is_eval and np.random.rand() <= self.epsilon:
		return random.randrange(self.action_size) - 1

	tensor = torch.FloatTensor(state).to(device)
	tensor = tensor.unsqueeze(0)
	options = self.target_net(tensor)
	# options = self.policy_net(tensor)
	return (np.argmax(options[-1].detach().cpu().numpy()) - 1)
	# return (np.argmax(options[0].detach().numpy()) - 1)
```