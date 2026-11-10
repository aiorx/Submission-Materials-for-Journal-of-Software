```python
@property
def is_rejected(self, refresh_order_info: bool = True) -> bool:
    """Specifies whether the order was rejected or not.

    Arguments:
    ----
    refresh_order_info {bool} -- Specifies whether you want
        to refresh the order data from the TD API before 
        checking. If `True` a request will be made to the
        TD API to grab the latest Order Info.

    Returns
    -------
    bool
        `True` if the order status is `REJECTED`, `False`
        otherwise.
    """

    if refresh_order_info:
        self.trade_obj._update_order_status()

    if self.order_status == 'REJECTED':
        return True
    else:
        return False
```