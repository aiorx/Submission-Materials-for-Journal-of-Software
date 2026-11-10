### Course: Zero to Mastery Academy | Prompt Engineering
### Section 5: Building Tic-Tac-Toe Game
### Game code, docstrings, and comments were all Crafted with standard coding tools.

### function displaying current board ----------------------------------------------------------------------------------
def display_board(board=list()) -> None:
    """
    Displays the current state of the Tic-Tac-Toe board.
    
    Args:
        board (list[str]): list of 9 elements (X | O | ' ') representing the current board
    """

    ### printing current board
    print(f"\n{board[0]} | {board[1]} | {board[2]}")
    print("--+---+--")
    print(f"{board[3]} | {board[4]} | {board[5]}")
    print("--+---+--")
    print(f"{board[6]} | {board[7]} | {board[8]}")

    ### returning
    return

### function executing move of human player ----------------------------------------------------------------------------
def player_move(board=list(), player=str()) -> None:
    """
    Prompts the player to input a move on the Tic-Tac-Toe board and updates the board accordingly.
    Keeps prompting the player for input until a valid move is made.
    
    Args:
        board (list[str]): list of 9 elements (X | O | ' ') representing the current board
        player (str): current player's mark (X | O).
    """

    ### looping until valid move is made
    while True:

        ## trying to make a move
        try:
            move = int(input(f"Player {player}, enter your move (1-9): ")) # obtaining player move
            move -= 1 # converting move to index
            if 0 <= move and move < 9 and board[move] == ' ': # move is valid
                board[move] = player # placing player mark on board
                break # exiting loop after valid move
            else: # move is invalid
                print("Invalid move. Try again.") # displaying error message
        
        ## handling non-integer input
        except ValueError:
            print("Please enter an integer between 1 and 9.") # displaying error message
    
    ### returning
    return

### function
def check_win(board, player):
    win_conditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]              # diagonals
    ]
    for condition in win_conditions:
        if all(board[i] == player for i in condition):
            return True
    return False

def check_draw(board):
    return ' ' not in board

### function for AI player ---------------------------------------------------------------------------------------------
def minimax(board=list(), is_maximizing=bool(), ai_player=str(), human_player=str()):
    """
    Finds the best possible move for the AI player using the Minimax algorithm.
    Recursively simulates the game to determine the best outcome for the AI player.
    Maximizes the score of the AI player and minimizes the score of the human player.
    
    Args:
        board (list[str]): list of 9 elements (X|O|' ') representing the current board
        is_maximizing (bool): True when AI player moves, False when human player moves
        ai_player (str): AI player's mark (X|O)
        human_player (str): human player's mark (X|O)
        
    Returns:
        int: score of best possible move (1 = AI win, -1 = human win, 0 = draw).
    """
    
    ### game over (win/loss/draw) > returning corresponding score
    if check_win(board, ai_player):
        return 1  # AI wins
    elif check_win(board, human_player):
        return -1  # Human wins
    elif check_draw(board):
        return 0  # Draw
    
    if is_maximizing:
        best_score = -float('inf')  # Initialize the best score for maximizing (AI) to negative infinity
        for i in range(9):  # Iterate over all possible moves
            if board[i] == ' ':
                board[i] = ai_player  # Simulate AI move
                score = minimax(board, False, ai_player, human_player)  # Recursively calculate the score
                board[i] = ' '  # Undo the move
                best_score = max(score, best_score)  # Choose the move with the maximum score
        return best_score  # Return the best score found for the AI
    else:
        best_score = float('inf')  # Initialize the best score for minimizing (human) to positive infinity
        for i in range(9):  # Iterate over all possible moves
            if board[i] == ' ':
                board[i] = human_player  # Simulate human move
                score = minimax(board, True, ai_player, human_player)  # Recursively calculate the score
                board[i] = ' '  # Undo the move
                best_score = min(score, best_score)  # Choose the move with the minimum score
        return best_score  # Return the best score found for the human player


def minimax(board, is_maximizing, ai_player, human_player):
    if check_win(board, ai_player):
        return 1
    elif check_win(board, human_player):
        return -1
    elif check_draw(board):
        return 0

    if is_maximizing:
        best_score = -float('inf')
        for i in range(9):
            if board[i] == ' ':
                board[i] = ai_player
                score = minimax(board, False, ai_player, human_player)
                board[i] = ' '
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if board[i] == ' ':
                board[i] = human_player
                score = minimax(board, True, ai_player, human_player)
                board[i] = ' '
                best_score = min(score, best_score)
        return best_score

def ai_move(board, ai_player):
    best_score = -float('inf')
    best_move = None
    human_player = 'X' if ai_player == 'O' else 'O'

    for i in range(9):
        if board[i] == ' ':
            board[i] = ai_player
            score = minimax(board, False, ai_player, human_player)
            board[i] = ' '
            if score > best_score:
                best_score = score
                best_move = i

    board[best_move] = ai_player

def tic_tac_toe():
    board = [' ' for _ in range(9)]
    human_player = 'X'
    ai_player = 'O'
    current_player = 'X'

    while True:
        display_board(board)
        if current_player == human_player:
            player_move(board, human_player)
        else:
            ai_move(board, ai_player)

        if check_win(board, current_player):
            display_board(board)
            print(f"Player {current_player} wins!")
            break
        elif check_draw(board):
            display_board(board)
            print("It's a draw!")
            break

        current_player = ai_player if current_player == human_player else human_player

tic_tac_toe()
