```python
def parse_args(args):  # pragma: no cover

    parser = argparse.ArgumentParser(description=__doc__)

    parser.add_argument('filename',
                        type=str,
                        help='Audio file to process')

    parser.add_argument('-o', '--output', dest='output',
                        type=argparse.FileType('w'),
                        default=sys.stdout,
                        help='Path to store JAMS output')

    return parser.parse_args(args)
```