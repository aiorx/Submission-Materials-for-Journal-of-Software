```python
def mail_enum(domain):
    print(c.BLUE + "\n[" + c.END + c.GREEN + "+" + c.END + c.BLUE + "] Trying to discover valid mail servers...\n" + c.END)
    sleep(0.5)
    data = pydig.query(domain, 'MX')

    for mail_output in data:
        mail_output = mail_output.split(' ')[1]
        l = len(mail_output)
        mail_servers = mail_output[:l-1]
        print(c.YELLOW + mail_servers + c.END)
```