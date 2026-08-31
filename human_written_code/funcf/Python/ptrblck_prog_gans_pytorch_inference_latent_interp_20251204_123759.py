```python
def main():
    global use_cuda
    args = parser.parse_args()

    if not args.weights:
        print('No PyTorch state dict path provided. Exiting...')
        return

    if args.cuda:
        use_cuda = True

    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if use_cuda:
        torch.cuda.manual_seed(args.seed)
    
    if not os.path.exists(args.output):
        os.mkdir(args.output)

    run(args)
```