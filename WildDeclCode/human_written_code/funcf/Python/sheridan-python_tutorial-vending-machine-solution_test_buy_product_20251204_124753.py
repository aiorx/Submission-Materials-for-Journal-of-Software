```python
def test_buy_banana():
    """
    Given that "banana" is purchased, a ValueError should be
    raised.
    """
    with pytest.raises(ValueError):
        buy_product('banana', 5)  # Random value of 5 balance
```