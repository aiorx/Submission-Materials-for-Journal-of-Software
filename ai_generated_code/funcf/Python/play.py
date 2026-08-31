```python
def _handle_user_input(scr):
    """
    Produced via common programming aids-4 lol
    """
    y_offset = 12
    x_offset = 14
    user_input = ""
    while True:
        ch = scr.getch()

        # Break the loop when the Enter key is pressed
        if ch == ord("\n"):
            break
        # Handle backspace
        elif ch == curses.KEY_BACKSPACE:
            if len(user_input) > 0:
                user_input = user_input[:-1]
                scr.addstr(y_offset, x_offset + len(user_input), " ")
                scr.move(y_offset, x_offset + len(user_input))
        # Append the character to the user input string
        else:
            user_input += chr(ch)
            scr.addch(y_offset, x_offset + len(user_input) - 1, ch)
    return user_input
```