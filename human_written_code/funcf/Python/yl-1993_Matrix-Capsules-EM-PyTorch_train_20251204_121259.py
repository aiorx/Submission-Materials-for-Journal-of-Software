```python
def get_setting(args):
    kwargs = {'num_workers': 1, 'pin_memory': True} if args.cuda else {}
    path = os.path.join(args.data_folder, args.dataset)
    if args.dataset == 'mnist':
        num_class = 10
        train_loader = torch.utils.data.DataLoader(
            datasets.MNIST(path, train=True, download=True,
                           transform=transforms.Compose([
                               transforms.ToTensor(),
                               transforms.Normalize((0.1307,), (0.3081,))
                           ])),
            batch_size=args.batch_size, shuffle=True, **kwargs)
        test_loader = torch.utils.data.DataLoader(
            datasets.MNIST(path, train=False,
                           transform=transforms.Compose([
                               transforms.ToTensor(),
                               transforms.Normalize((0.1307,), (0.3081,))
                           ])),
            batch_size=args.test_batch_size, shuffle=True, **kwargs)
    elif args.dataset == 'smallNORB':
        num_class = 5
        train_loader = torch.utils.data.DataLoader(
            smallNORB(path, train=True, download=True,
                      transform=transforms.Compose([
                          transforms.Resize(48),
                          transforms.RandomCrop(32),
                          transforms.ColorJitter(brightness=32./255, contrast=0.5),
                          transforms.ToTensor()
                      ])),
            batch_size=args.batch_size, shuffle=True, **kwargs)
        test_loader = torch.utils.data.DataLoader(
            smallNORB(path, train=False,
                      transform=transforms.Compose([
                          transforms.Resize(48),
                          transforms.CenterCrop(32),
                          transforms.ToTensor()
                      ])),
            batch_size=args.test_batch_size, shuffle=True, **kwargs)
    else:
        raise ValueError('Unknown dataset: {}'.format(args.dataset))
    return train_loader, test_loader, num_class
```