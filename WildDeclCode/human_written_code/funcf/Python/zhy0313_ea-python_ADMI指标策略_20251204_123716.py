```python
def initialize(context):
    # 设置回测频率, 可选："1m", "5m", "15m", "30m", "60m", "4h", "1d", "1w"
    context.frequency = "1d"
    # 设置回测基准, 比特币："huobi_cny_btc", 莱特币："huobi_cny_ltc", 以太坊："huobi_cny_eth"
    context.benchmark = "huobi_cny_btc"
    # 设置回测标的, 比特币："huobi_cny_btc", 莱特币："huobi_cny_ltc", 以太坊："huobi_cny_eth"
    context.security = "huobi_cny_btc"

    # 获取历史数据的长度
    context.user_data.adx_window = 7
    context.user_data.adx_buy_line = 40  # 看多买入线
    context.user_data.adx_sell_line = 20  # 看空卖出线

    # 至此initialize函数定义完毕。
```