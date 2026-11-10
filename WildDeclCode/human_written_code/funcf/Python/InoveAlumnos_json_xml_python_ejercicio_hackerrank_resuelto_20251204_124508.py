```python
def transform(dataset):
    data = {}

    # Almacenar en un diccionario el acumulado
    # de gastos de cada usuario
    for i in range(len(dataset)):
        variable = dataset[i]
        userid = variable['userId']
        amount_str = variable['amount']
        amount = float(re.sub(r'[^\d\-.]', '', amount_str))

        if (userid in dataset ) == False:
            data[userid] = 0

        data[userid] =  data[userid] + amount

    # Armar la lista de usuarios y debitos
    data_list = [[key, value] for key,value in data.items()]
    return data_list
```