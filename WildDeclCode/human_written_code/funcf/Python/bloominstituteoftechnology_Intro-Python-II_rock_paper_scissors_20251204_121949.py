```python
def save_results(w, t, l):
    text_file = open("history.txt", "w")
    text_file.write(str(w) + "," + str(t) + "," + str(l))
    text_file.close()
```