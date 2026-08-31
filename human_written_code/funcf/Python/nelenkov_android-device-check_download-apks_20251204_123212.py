```python
def download_apks(apk_paths, download_path):
    if not os.path.exists(download_path):
        os.makedirs(download_path)

    for apk in apk_paths:
        print 'Getting %s...' % apk
        cmd = 'adb pull %s %s/%s' % (apk, download_path, os.path.basename(apk))
        p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        result = p.communicate()
        if p.returncode != 0:
            print 'Error: rc=%d, msg=%s' % (p.returncode, result[1])
```