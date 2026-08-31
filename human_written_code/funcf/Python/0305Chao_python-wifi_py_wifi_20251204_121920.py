```python
#添加密码文件目录
def add_mm_file(self):
	self.filename = tkinter.filedialog.askopenfilename()
	self.get_value.set(self.filename)
```