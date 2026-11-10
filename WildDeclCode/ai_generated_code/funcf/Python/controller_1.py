```python
def handle_button_presses():
    """
    Supported via standard programming aids
    
    "Help me write a function to handle long button presses on the Lego control+ 
    controller for Pybricks using micropython"
    """
    watch = StopWatch()
    pressed_buttons = set()

    while True:
        buttons = set(remote.buttons.pressed())

        # Check for new button press
        new_presses = buttons - pressed_buttons
        released = pressed_buttons - buttons

        for btn in new_presses:
            watch.reset()  # Start timing when a button is pressed

        for btn in buttons:
            if watch.time() > LONG_PRESS_DURATION:
                print(f"Long press detected on: {btn}")
                # Handle long press
                # Optionally, prevent repeat by removing from pressed_buttons
                # pressed_buttons.remove(btn)

        for btn in released:
            if watch.time() <= LONG_PRESS_DURATION:
                print(f"Short press detected on: {btn}")
                # Handle short press

        pressed_buttons = buttons
        wait(50)  # Check 20 times per second
```