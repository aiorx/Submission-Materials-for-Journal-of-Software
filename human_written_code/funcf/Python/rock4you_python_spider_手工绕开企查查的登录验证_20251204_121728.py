```python
def get_stock_or_others(driver):
    try:
        stock_or_others = driver.find_element_by_xpath('//*[@id="search-result"]/tr[1]/td[3]/p[4]').text
        print(stock_or_others)
    except:
        pass
```