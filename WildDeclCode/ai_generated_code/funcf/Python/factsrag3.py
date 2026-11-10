```python
def get_file_sha256(self, file_path: str) -> str:
    """
    Get the SHA256 hash of a file. We use this to warn the user if/when the database is being saved and potetially conflicts with the underlying file. Written Aided via basic GitHub coding utilities! 🙌

    Args:
        file_path (str): The path to the file.

    Returns:
        str: The SHA256 hash of the file.
    """
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()
```