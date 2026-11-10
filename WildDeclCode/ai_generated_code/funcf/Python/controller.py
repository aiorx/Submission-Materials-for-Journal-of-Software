```python
def md5(file_path: str, buffer_size: int = 8192) -> str:
    """
    Compute the MD5 hash of a file. Composed with basic coding tools.

    Args:
    - file_path (str): Path to the file.
    - buffer_size (int, optional): Size of the buffer to read in bytes. Default is 8192.

    Returns:
    - str: MD5 hash of the file.
    """
    md5_hash = hashlib.md5()

    with open(file_path, 'rb') as f:
        # Read the file in chunks
        for chunk in iter(lambda: f.read(buffer_size), b''):
            md5_hash.update(chunk)

    return md5_hash.hexdigest()
```