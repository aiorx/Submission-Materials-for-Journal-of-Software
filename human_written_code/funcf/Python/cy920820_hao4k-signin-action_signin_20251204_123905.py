```python
def run(form_data):
    s = requests.Session()
    s.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36'})
    headers = {"Content-Type": "text/html", 'Connection': 'close'}
    user_resp = s.get(user_url,headers=headers)
    login_text = re.findall('action="(.*?)"', user_resp.text)
    for loginhash in login_text:
        if 'loginhash' in loginhash:
            login_url = base_url + loginhash + inajax
            login_url = login_url.replace("amp;", "")
            print(login_url)
    form_text = re.search('formhash=(.*?)\'', user_resp.text)
    print(form_text.group(1))
    form_data['formhash'] = form_text.group(1)
    print(form_data)

    login_resp = s.post(login_url, data=form_data)
    test_resp = s.get('https://www.hao4k.cn/k_misign-sign.html',headers=headers)
    if username in test_resp.text:
      print('login!')
    else:
      return 'login failed!'
    signin_text = re.search('formhash=(.*?)"', test_resp.text)
    signin_resp = s.get(signin_url.format(formhash=signin_text.group(1)))
    test_resp = s.get('https://www.hao4k.cn/k_misign-sign.html',headers=headers)
    if '您的签到排名' in test_resp.text:
      print('signin!')
    else:
      return 'signin failed!'
```