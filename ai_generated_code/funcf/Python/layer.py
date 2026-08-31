```python
def MNIST():
	"""
	Most of this function is Supported via standard GitHub programming aids
	Hail GPT!
	"""
	from torchvision import datasets, transforms
	from torch.utils.data import DataLoader
	from torch import optim
	from torch.nn import functional as F
	from sklearn.metrics import accuracy_score

	device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
	train_loader = DataLoader(datasets.MNIST('data', train=True, download=True, transform=transforms.ToTensor()),
	                          							  batch_size=128, shuffle=True)
	test_loader = DataLoader(datasets.MNIST('data', train=False, download=True, transform=transforms.ToTensor()),
	                          							  batch_size=128, shuffle=True)

	model = nn.Sequential(
		nn.Flatten(),
		nn.Linear(28*28, 100),
		nn.Tanh(),
		TanhFixedPointLayer(100),
		nn.Linear(100, 10)
	).to(device)

	optimizer = optim.Adam(model.parameters(), lr=1e-3)
	loss_fn = F.cross_entropy

	for e in range(2):
		for b, (x, y) in enumerate(train_loader):
			x, y = x.to(device), y.to(device)
			optimizer.zero_grad()
			y_hat = model(x)
			loss = loss_fn(y_hat, y)
			loss.backward()
			optimizer.step()

			yhat = torch.argmax(y_hat, dim=1)
			acc = accuracy_score(y.cpu().numpy(), yhat.cpu().numpy())
			print(f'Epoch {e}, batch {b} / {len(train_loader)}, loss {loss.item():.4f}, acc {acc:.4f}')
```