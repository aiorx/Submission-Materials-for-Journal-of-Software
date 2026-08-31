```python
def dragEnterEvent(self, e):
    if e.mimeData().text().endswith('.srt'):
        e.accept()
    else:
        e.ignore()
```