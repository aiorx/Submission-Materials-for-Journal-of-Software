```python
def legalMoves( self ):
    """
      Returns a list of legal moves from the current state.

    Moves consist of moving the blank space up, down, left or right.
    These are encoded as 'up', 'down', 'left' and 'right' respectively.

    >>> EightPuzzleState([0, 1, 2, 3, 4, 5, 6, 7, 8]).legalMoves()
    ['down', 'right']
    """
    moves = []
    row, col = self.blankLocation
    if(row != 0):
        moves.append('up')
    if(row != 2):
        moves.append('down')
    if(col != 0):
        moves.append('left')
    if(col != 2):
        moves.append('right')
    return moves
```