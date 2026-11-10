```python
def fetch_paper(url, path):
    """
    Fetch a paper from the given URL and save it to the specified path.
    """
    try:
        response = requests.get(url)
        with open(path, 'wb') as f:
            f.write(response.content)
    except requests.exceptions.RequestException as e:
        print("Error: {}".format(e))
```