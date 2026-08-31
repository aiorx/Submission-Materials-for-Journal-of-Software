```python
def make_if_not_exist(dir=''):
    dir = os.path.expanduser(dir)
    if not os.path.exists(dir):
        subprocess.check_call("mkdir {}".format(dir), shell=True)
```