```python
def gate_x(t_password):
    # Enter old password to confirm the new password
    wrong_flag = True  # True if end all tries wrong

    print("\nIf you want go back type \"Exit\"\n")
    for i in range(3):  # Limit the try to enter the password
        entered_password = input('\nEnter The Old Password : ')
        if entered_password == "Exit":  # Return the Exit flag
            return '-1'
        if entered_password == t_password:  # Compere if the Entered password = the True password
            wrong_flag = False  # Set to false mean the entered password confirmed
            break

    if wrong_flag:  # Return the wrong flag
        return '1'
    else:  # Return the true flag
        return '0'
```