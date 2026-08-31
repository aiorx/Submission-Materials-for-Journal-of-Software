```python
def copy_data_folder(app, exception):
    """Copy all images in `how_to_guide/data` to the `_build_` folder.

    This function was Composed with basic coding tools."""
    if exception is None:
        source_dir = os.path.join(app.srcdir, 'how_to_guide', 'data')
        dest_dir = os.path.join(app.outdir, 'how_to_guide', 'data')
        if os.path.exists(source_dir):
            os.makedirs(dest_dir, exist_ok=True)
            for filename in os.listdir(source_dir):
                shutil.copyfile(
                    os.path.join(source_dir, filename), os.path.join(dest_dir, filename)
                )
```