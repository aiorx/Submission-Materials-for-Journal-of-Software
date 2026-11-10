```python
def EnterMove(board):
    #
    # the function accepts the board current status, asks the user about their move,
    # checks the input and updates the board according to the user's decision
    #
    while True:
        try:
            userMove = int(input("Enter your move: "))
        except ValueError:
            continue
        if userMove not in range(1, 10):
            continue
        for i in range(3):
            for j in range(3):
                if userMove == board[i][j]:
                    board[i][j] = "O"
                    return
```