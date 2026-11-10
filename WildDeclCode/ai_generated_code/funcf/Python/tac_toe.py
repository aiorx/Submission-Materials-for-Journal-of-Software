```python
def checkWin(win, A): #Guys I might just be the smartest person on earth (Thanks chatGPT for the help in figuring out how to do this)

    winCondition = [
[(3, 5), (3, 7), (3, 9)], #TOP 
[(5, 5), (5, 7), (5, 9)], #MIDDLE
[(7, 5), (7, 7), (7, 9)], #BOTTOM 
[(3, 5), (5, 5), (7, 5)], #LEFT
[(3, 7), (5, 7), (7, 7)],  #MIDDLE
[(3, 9), (5, 9), (7, 9)], #RIGHT
[(7, 5), (5, 7), (3, 9)],  # /
[(3, 5), (5, 7), (7, 9)]  # \
    ]

    for condition in winCondition:
        if all(win.inch(y, x) & curses.A_CHARTEXT == A for y, x in condition):
            return True

    return False
```