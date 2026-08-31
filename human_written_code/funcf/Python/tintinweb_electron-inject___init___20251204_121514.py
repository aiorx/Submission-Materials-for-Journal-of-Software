```python
def launch_url(url):
    #https://stackoverflow.com/questions/4216985/call-to-operating-system-to-open-url
    if sys.platform == 'win32':
        os.startfile(url)
    elif sys.platform == 'darwin':
        subprocess.Popen(['open', url])
    else:
        try:
            subprocess.Popen(['xdg-open', url])
        except OSError:
            pass
```