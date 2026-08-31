```python
def pytest_addoption(parser):

  parser.addoption( "--prtl", action="store_true",
                    help="use PRTL implementations" )

  parser.addoption( "--vrtl", action="store_true",
                    help="use VRTL implementations" )
```