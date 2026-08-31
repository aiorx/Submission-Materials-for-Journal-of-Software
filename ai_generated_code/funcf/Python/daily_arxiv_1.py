```python
def get_code_link(qword:str, session=None) -> str:
    """
    This short function was auto-Assisted with basic coding tools. 
    I only renamed some params and added some comments.
    @param qword: query string, eg. arxiv ids and paper titles
    @param session: requests session for connection reuse
    @return paper_code in github: string, if not found, return None
    """
    if session is None:
        session = requests
        
    query = f"{qword}"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc"
    }
    
    try:
        time.sleep(1)  # Rate limiting for GitHub API
        r = session.get(github_url, params=params, timeout=10)
        
        if r.status_code == 200:
            results = r.json()
            code_link = None
            if results["total_count"] > 0:
                code_link = results["items"][0]["html_url"]
            return code_link
        else:
            logging.warning(f"GitHub API returned status {r.status_code} for query: {qword}")
            return None
            
    except requests.exceptions.RequestException as e:
        logging.error(f"Error querying GitHub for {qword}: {e}")
        return None
    except json.JSONDecodeError:
        logging.error(f"Invalid JSON response from GitHub API for {qword}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error in get_code_link for {qword}: {e}")
        return None
```