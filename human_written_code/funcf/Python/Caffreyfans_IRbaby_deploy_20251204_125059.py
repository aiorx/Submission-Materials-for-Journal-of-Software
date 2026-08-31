```python
def get_latest_release_download_url(repo_owner, repo_name):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/releases/latest'
    response = requests.get(url)
    data = json.loads(response.text)
    return data['assets'][0]['browser_download_url'], data["tag_name"]
```