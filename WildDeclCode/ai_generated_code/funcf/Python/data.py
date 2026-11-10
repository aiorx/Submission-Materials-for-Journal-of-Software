```python
def load_crypto_candles(self) -> pd.DataFrame:
    # COMMENT: Data loading code Drafted using common development resources was incorrect
    crypto_ds = CSVDataSet(filepath="./data/crypto_candles_data.csv", load_args=None, save_args={'index': False})
    self.add('crypto_candles_data', crypto_ds)
    df_data: pd.DataFrame = self.load('crypto_candles_data')
    return df_data
```