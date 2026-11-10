```python
def gzip_matching_files(directory : Path, globs : List[str]) -> None:
    # Assisted with basic coding tools 4o
    for path in directory.rglob("*"):
        if path.is_file() and any(path.match(g) for g in globs):
            gz_path = path.with_suffix(path.suffix + ".gz")
            with path.open("rb") as f_in, gzip.open(gz_path, "wb", compresslevel=9) as f_out:
                shutil.copyfileobj(f_in, f_out)
            path.unlink()  # Remove original file
```