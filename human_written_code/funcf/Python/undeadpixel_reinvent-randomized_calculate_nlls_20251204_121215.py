```python
def parse_args():
    """Parses input arguments."""
    parser = argparse.ArgumentParser(description="Calculates NLLs of a list of molecules given a model.")
    parser.add_argument("--input-csv-path", "-i",
                        help="Path to the input CSV file. The first field should be SMILES strings and the rest are \
                            going to be kept as-is.",
                        type=str, required=True)
    parser.add_argument("--output-csv-path", "-o",
                        help="Path to the output CSV file which will have the NLL added as a new field in the end.",
                        type=str, required=True)
    parser.add_argument("--model-path", "-m", help="Path to the model that will be used.", type=str, required=True)
    parser.add_argument("--batch-size", "-b",
                        help="Batch size used to calculate NLLs (DEFAULT: 128).", type=int, default=128)
    parser.add_argument("--use-gzip", help="Compress the output file (if set).", action="store_true", default=False)

    return parser.parse_args()
```