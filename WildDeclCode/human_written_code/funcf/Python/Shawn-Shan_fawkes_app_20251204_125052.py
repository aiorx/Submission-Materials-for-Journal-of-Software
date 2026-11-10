```python
def open_dialog_box(self):
    qfd = QFileDialog()
    path = "."
    filter = "Images (*.png *.xpm *.jpg *jpeg *.gif)"

    filename = QFileDialog.getOpenFileNames(qfd, "Select Image(s)", path, filter)
    self.img_paths = filename[0]
    print("Selected paths", self.img_paths)
    self.labelA.setText('Selected {} images'.format(len(self.img_paths)))
```