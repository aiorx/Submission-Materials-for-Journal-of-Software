```python
def buttonClicked(self, e):
    btn_txt = self.sender().text()
    QMessageBox.information(self, 'Events - Slot', 'click en: ' + btn_txt)
```