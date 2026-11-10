```python
parser = argparse.ArgumentParser(description='Process some integers.')

parser.add_argument('--enemies_only',
                    action='store_true',
                    # dest='accumulate',
                    # action='store_const',
                    # const=sum,
                    # default=max,
                    help='only add enemies')

args = parser.parse_args()
print(args)
```