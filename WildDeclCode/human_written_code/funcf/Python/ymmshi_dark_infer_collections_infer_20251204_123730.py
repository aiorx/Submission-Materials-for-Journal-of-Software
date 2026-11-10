```python
def load_data_paths():
    global in_path, out_path
    if os.path.isfile(in_path):
        input_paths = [in_path]
        in_path = os.path.dirname(in_path)
    elif os.path.isdir(in_path):
        input_paths = []
        for root, dirs, files in os.walk(in_path):
            for name in files:
                for ext in ['.jpg', '.png', '.jpeg', '.bmp']:
                    if name.lower().endswith(ext):
                        input_paths.append(os.path.join(root, name))
    return input_paths
```