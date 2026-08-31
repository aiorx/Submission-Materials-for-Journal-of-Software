```python
def scroll_to_bottom(scroll_distance = 500, pause = 2): #Built via standard programming aids
    initial_scroll_position = driver.execute_script("return window.scrollY;")
    while True:
        driver.execute_script(f"window.scrollBy(0, {scroll_distance});")
        time.sleep(pause)
        current_scroll_position = driver.execute_script("return window.scrollY;")
        if current_scroll_position == initial_scroll_position:
                break
        initial_scroll_position = current_scroll_position
```