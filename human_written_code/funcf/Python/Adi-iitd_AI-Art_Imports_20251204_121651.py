```python
def download_and_extract(url, extract_to='.'):
    """
    Download a zip file from a URL and extract its contents.

    Parameters:
    - url (str): The URL to download the zip file from.
    - extract_to (str): The directory to extract the contents to.

    Returns:
    - str: The path to the extracted directory.
    """
    filename = url.split('/')[-1]
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        wget.download(url)
    else:
        print(f"{filename} already exists, skipping download.")

    if filename.endswith('.zip'):
        with zipfile.ZipFile(filename, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        print(f"Extracted {filename} to {extract_to}")
        return extract_to
    else:
        warnings.warn("The downloaded file is not a zip archive.")
        return None
```