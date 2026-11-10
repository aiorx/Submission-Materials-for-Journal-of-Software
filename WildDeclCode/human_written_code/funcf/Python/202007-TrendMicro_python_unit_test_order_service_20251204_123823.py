```python
def get_orders(self) -> list:
    my_list = []
    with open(self.order_path, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            my_list.append(Order(row[0], row[1], row[2], row[3]))

    return my_list
```