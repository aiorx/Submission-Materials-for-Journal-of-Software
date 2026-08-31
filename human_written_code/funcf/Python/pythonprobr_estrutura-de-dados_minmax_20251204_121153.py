```python
def _minmax_recursiva(iterador: Iterator, valor_minimo: Number, valor_maximo: Number):
    try:
        elemento = next(iterador)
    except StopIteration:
        return valor_minimo, valor_maximo
    else:
        if elemento < valor_minimo:
            valor_minimo = elemento
        if elemento > valor_maximo:
            valor_maximo = elemento
        return _minmax_recursiva(iterador, valor_minimo, valor_maximo)
```