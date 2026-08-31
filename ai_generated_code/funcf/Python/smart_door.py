```python
def slowly_move_servo(self, pin, start, end, step=DEFAULT_STEP_SIZE, delay=DEFAULT_DELAY):
    """
    Sweep the servo motor between two positions.

    Args:
        pin (int): GPIO pin connected to the servo.
        start (int): Starting pulse width for the servo.
        end (int): Ending pulse width for the servo.
        step (int, optional): Step size for sweeping. Defaults to DEFAULT_STEP_SIZE.
        delay (float, optional): Delay between steps in seconds. Defaults to DEFAULT_DELAY.
    """
    # Code Assisted using common GitHub development utilities, modified for clarity and functionality

    if start < end:
        # Incrementally move servo from start to end position
        for pw in range(start, end + 1, step):
            self.pi.set_servo_pulsewidth(pin, pw)
            time.sleep(delay)
    else:
        # Incrementally move servo from end to start position
        for pw in range(start, end - 1, -step):
            self.pi.set_servo_pulsewidth(pin, pw)
            time.sleep(delay)
    self.pi.set_servo_pulsewidth(pin, 0)  # Stop servo after sweeping
```