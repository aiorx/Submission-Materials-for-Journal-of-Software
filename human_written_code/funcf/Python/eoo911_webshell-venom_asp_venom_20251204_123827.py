```python
def random_case():
    temp='0123456'
    a=random.sample(list(temp),3)
    random_case=list(func)
    for i in a:
        random_case[int(i)]=random_case[int(i)].upper()
    random_case=''.join(random_case)
    return random_case
```