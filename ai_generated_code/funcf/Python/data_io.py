```python
def gather_json_files(directory):
    """
    Gather all json files in a given directory, including child directories.
    Args:
        directory (str): directory to find json files in
    Reutrns:
        (list): paths to json files 
    """
    # thanks chatgpt for this error handling 
    if not isinstance(directory, (str, bytes, os.PathLike)):
        raise TypeError("The directory must be a string, bytes, or os.PathLike object.")
    if not os.path.isdir(directory):
        raise ValueError("The provided directory path does not exist or is not a directory.")
    
    json_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                json_files.append(os.path.join(root, file))
    return json_files
```

```python
def list_folders(directory):
    """
    List the child directories in a given directory
    Args:
        directory (str): directory to be parsed
    Returns:
        folders (list): list of strings of paths to directories. 
    """
    # thanks chatgpt for error handling
    if not isinstance(directory, (str, bytes, os.PathLike)):
        raise TypeError("The directory must be a string, bytes, or os.PathLike object.")
    if not os.path.isdir(directory):
        raise ValueError("The provided directory path does not exist or is not a directory.")
    
    folders = [entry.name for entry in os.scandir(directory) if entry.is_dir()]
    return folders
```

```python
def find_logs_dir(directory):
    """
    List the child directories containing the term 'logs' in a given directory
    Args:
        directory (str): directory to be parsed
    Returns:
        folders (list): list of strings of paths to directories containing 'logs'.
    """
    # thanks chatgpt for error handling
    if not isinstance(directory, (str, bytes, os.PathLike)):
        raise TypeError("The directory must be a string, bytes, or os.PathLike object.")
    if not os.path.isdir(directory):
        raise ValueError("The provided directory path does not exist or is not a directory.")
    
    folders_with_logs = []
    with os.scandir(directory) as entries:
        for entry in entries:
            if entry.is_dir() and 'logs' in entry.name:
                folders_with_logs.append(entry.path)
    
    return folders_with_logs
```