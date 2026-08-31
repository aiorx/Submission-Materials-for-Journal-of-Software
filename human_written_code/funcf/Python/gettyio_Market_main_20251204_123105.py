```python
def initialize():
    """ 初始化
    """

    for platform in config.platforms:
        if platform == OKEX:
            from platforms.okex import OKEx as Market
        elif platform == OKEX_FUTURE:
            from platforms.okex_ftu import OKExFuture as Market
        elif platform == BINANCE:
            from platforms.binance import Binance as Market
        elif platform == DERIBIT:
            from platforms.deribit import Deribit as Market
        else:
            from quant.utils import logger
            logger.error("platform error! platform:", platform)
            continue
        Market()
```