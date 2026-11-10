```python
def calculate_profitability(revenue, costs):
    profit = revenue - costs
    if profit > 0:
        profitability = profit / revenue
        return profit, profitability
    else:
        return profit, None
```