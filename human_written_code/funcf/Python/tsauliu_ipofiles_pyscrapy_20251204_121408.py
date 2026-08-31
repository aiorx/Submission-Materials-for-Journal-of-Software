```python
def download_pdfs(urldict):
    import urllib2
    for name in urldict:
        url = urldict[name]
        response = urllib2.urlopen(url)
        file = open('./output/' + name + ".pdf", 'wb')
        file.write(response.read())
        file.close()
        print(name)
```