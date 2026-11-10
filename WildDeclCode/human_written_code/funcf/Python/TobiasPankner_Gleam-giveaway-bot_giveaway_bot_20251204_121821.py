```python
if __name__ == '__main__':
    try:
        main()
    finally:
        utils.stop_loading_text()
        browser.close_driver()
```