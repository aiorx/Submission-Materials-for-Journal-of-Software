```python
if ':' in token: 
    enp = token.split(':')
    if autojoinServer == True:
        if sys.platform == "win32":
            p = subprocess.Popen(['python','bots/misc/joinServer.py',enp[0],enp[1],inviteLink,useBrowser],shell=True)
            p.wait()
        else:
            p = subprocess.Popen(['python3','bots/misc/joinServer.py',enp[0],enp[1],inviteLink,useBrowser])
            p.wait()
```