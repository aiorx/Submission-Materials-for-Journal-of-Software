```python
class CoinVolatilityFile(CoinVolatility):
    def __init__(self, volatility_file_path):
        try:
            with open(volatility_file_path) as data:
                self._values = json.load(data)
        except FileNotFoundError as e:
            raise ConfigurationFileMissing("Missing coin volatility file.") from e
```