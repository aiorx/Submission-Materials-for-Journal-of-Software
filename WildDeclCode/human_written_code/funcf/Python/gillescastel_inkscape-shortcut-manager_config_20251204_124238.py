```python
def open_editor(filename):
    subprocess.run([
        'urxvt',
        '-geometry', '60x5',
        '-name', 'popup-bottom-center',
        '-e', "vim",
        f"{filename}",
    ])
```