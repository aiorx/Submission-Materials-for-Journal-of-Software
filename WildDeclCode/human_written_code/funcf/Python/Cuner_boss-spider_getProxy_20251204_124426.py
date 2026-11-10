```python
def get_proxy_list(page=1):
    import bs4
    import requests

    url = 'https://www.xicidaili.com/nn/' + str(page)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
    }
    web_data = requests.get(url, headers=headers)
    soup = bs4.BeautifulSoup(web_data.text, 'html.parser')
    proxy_list = []
    ips = soup.find_all('tr')
    for i in range(1, len(ips)):
        ip_info = ips[i]
        tds = ip_info.find_all('td')
        if tds[5].text == 'HTTPS':
            proxy_list.append('https://' + tds[1].text + ':' + tds[2].text)
        elif tds[5].text == 'HTTP':
            proxy_list.append('http://' + tds[1].text + ':' + tds[2].text)
    return proxy_list
```