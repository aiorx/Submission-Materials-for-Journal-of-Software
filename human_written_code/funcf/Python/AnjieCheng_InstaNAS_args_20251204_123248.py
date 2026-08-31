```python
def parse_args():
    args = arg_parser.parse_args()
    if args.eval == '':
        args.eval = None
    return args
```