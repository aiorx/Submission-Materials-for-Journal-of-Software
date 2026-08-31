```python
def save_predictions(filename, test_list_path, predictions):
    """
    Save the predictions to a CSV file for submission.

    Args:
        filename (str): Path to the output CSV file.
        test_list_path (str): Path to the JSON file containing the test list.
        predictions (list): List of predicted strings.

    """
    with open(test_list_path, 'r') as f:
        test_list = json.load(f)

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['file_name', 'label'])
        for file_name, pred in zip(test_list, predictions):
            writer.writerow([file_name, pred])
```