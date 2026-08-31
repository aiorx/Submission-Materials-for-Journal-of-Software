```python
def get_schema():
    '''Get the schema used to abbreviate columns names on get_fundamentos DataFrame
    '''
    return (pd.DataFrame(schema.items(), columns=['Significado', 'Abreviação'])
            .set_index('Abreviação'))
```