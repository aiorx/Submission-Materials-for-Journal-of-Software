```python
def check_jar_exsits(site, upload_jar_name):
    list_jar_url = "{}/jars/".format(site)
    response = requests.get(list_jar_url, headers=default_headers, verify=False, timeout=30, proxies=proxies)
    if response.status_code == 200 and "application/json" in response.headers.get("Content-Type", ""):
        try:
            r = json.loads(response.text)
            for upload_file in r['files']:
                if str(upload_file['id']).endswith('{}'.format(upload_jar_name)):
                    return upload_file['id']
        except Exception as e:
            return False
    return False
```