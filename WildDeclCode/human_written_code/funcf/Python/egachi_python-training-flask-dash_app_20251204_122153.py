```python
def create_trace_for_continent(i, df):
    return dict(
        x=df[df['continent'] == i]['gdp per capita'],
        y=df[df['continent'] == i]['life expectancy'],
        text=df[df['continent'] == i]['country'],
        mode='markers',
        opacity=0.7,
        marker={
            'size': 15,
            'line': {'width': 0.5, 'color': 'white'}
        },
        name=i
    )
```