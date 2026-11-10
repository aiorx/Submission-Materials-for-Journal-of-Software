```python
def existe_cliente(lista, email):
    if len(lista) > 0:
        for cliente in lista:
            if cliente['email'] == email:
                 return True
    return False
```