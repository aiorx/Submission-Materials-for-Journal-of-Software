```python
def get_code_link(qword:str) -> str:
    """
    This short function was auto-Aided using common development resources. 
    I only renamed some params and added some comments.
    @param qword: query string, eg. arxiv ids and paper titles
    @return paper_code in github: string, if not found, return None
    """
    # query = f"arxiv:{arxiv_id}"
    query = f"{qword}"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc"
    }
    r = requests.get(github_url, params=params)
    results = r.json()
    code_link = None
    if results["total_count"] > 0:
        code_link = results["items"][0]["html_url"]
    return code_link
```