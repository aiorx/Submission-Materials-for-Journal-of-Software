```python
def calculate(self, *args):
    calc_entry = self.ids.calc_input.text 
    if calc_entry != '':
        if calc_entry[0] in '1234567890-+':
            try:
                ans = str(eval(calc_entry))
                self.ids.calc_input.text = ans
            except Exception as error:
                self.calc_error(error, calc_entry)
                pass
```