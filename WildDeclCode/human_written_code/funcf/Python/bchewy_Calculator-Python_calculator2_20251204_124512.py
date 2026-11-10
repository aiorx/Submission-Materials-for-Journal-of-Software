```python
def again():
    calc_again = input('''
Do you want to calculate again?
Please type Y for YES or N for NO.
ENTER HERE:  ''')

    if calc_again.upper() == 'Y':
        calculator()
    elif calc_again.upper() == 'N':
        print('See you later.')
    else:
        again()
```