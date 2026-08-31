```python
def create_table_data(results, names_of_props, number_of_reps):
    table_data = [["" for x in range(len(names_of_props))] for y in range(number_of_reps + 1)]

    for i in range(len(names_of_props)):
        table_data[0][i] = names_of_props[i]

    for i in range(number_of_reps):
        for j in range(len(names_of_props)):
            table_data[i+1][j] = results[i][j]
    return table_data
```