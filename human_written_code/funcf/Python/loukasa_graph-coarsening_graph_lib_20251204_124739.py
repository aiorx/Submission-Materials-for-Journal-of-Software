```python
def download_yeast():
    r"""
    A convenience method for loading a network of protein-to-protein interactions in budding yeast.

    http://networkrepository.com/bio-yeast.php
    """
    with tempfile.TemporaryDirectory() as tempdir:
        zip_filename = os.path.join(tempdir, "bio-yeast.zip")
        with open(zip_filename, "wb") as zip_handle:
            opener = request.build_opener()
            opener.addheaders = _MOZILLA_HEADERS
            request.install_opener(opener)
            with request.urlopen(_YEAST_URL) as url_handle:
                zip_handle.write(url_handle.read())
        with zipfile.ZipFile(zip_filename) as zip_handle:
            zip_handle.extractall(tempdir)
        mtx_filename = os.path.join(tempdir, "bio-yeast.mtx")
        with open(mtx_filename, "r") as mtx_handle:
            _ = next(mtx_handle)  # header
            n_rows, n_cols, _ = next(mtx_handle).split(" ")
            E = np.loadtxt(mtx_handle)
    E = E.astype(int) - 1
    W = sparse.lil_matrix((int(n_rows), int(n_cols)))
    W[(E[:, 0], E[:, 1])] = 1
    W = W.tocsr()
    W += W.T
    return W
```