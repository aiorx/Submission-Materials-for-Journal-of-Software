```python
def main():
    api = AO3()
    api.login(username=AO3_USERNAME, password=AO3_PASSWORD)

    for work_id, last_read in api.user.reading_history():
        if last_read < (datetime.now() - timedelta(days=7)).date():
            break
        try:
            work = api.work(id=work_id)
        except RestrictedWork:
            print('Skipping %s as a restricted work' % work_id)
            continue
        if api.user.username in work.kudos_left_by:
            title = '%s - %s - %s [Archive of Our Own]' % (
                work.title, work.author, work.fandoms[0])
            print('Saving %s to Pinboard...' % work.url)
            requests.get('https://api.pinboard.in/v1/posts/add', params={
                'url': work.url,
                'description': title,
                'tags': 'ao3_kudos_sync',
                'replace': 'no',
                'auth_token': PINBOARD_API_TOKEN,
                'format': 'json',
            })
```