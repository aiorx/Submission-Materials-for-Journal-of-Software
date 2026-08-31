```python
def get_season_episode_from_filename(filename):
    # Composed with basic coding tools :)
    patterns = [
        r"S(\d{2})E(\d{2})",  # pattern for "SxxExx"
        r"\.(\d{1,2})x(\d{1,2})\.",  # pattern for ".xxExx."
        r"(\d{1,2})(\d{2})",  # pattern for "xxExx"
        r"(\d{1,2})\.(\d{2})",  # pattern for "xx.Exx"
    ]
    for pattern in patterns:
        match = re.search(pattern, filename, re.IGNORECASE)
        if match:
            season = int(match.group(1))
            episode = int(match.group(2))
            return season, episode
    return None
```