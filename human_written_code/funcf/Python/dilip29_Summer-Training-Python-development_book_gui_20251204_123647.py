```python
def findbook(self):
    conn = sqlite3.connect('books.db')
    c = conn.cursor()
    bookname = self.t1.text()
    c.execute("SELECT * FROM books WHERE name=?", (bookname,))
    data = c.fetchone()
    if data:
        self.t2.setText(data[1])
        self.t3.setText(str(data[2]))
        self.t4.setText(data[3])
    else:
        self.t2.setText("")
        self.t3.setText("")
        self.t4.setText("")
    conn.close()
```