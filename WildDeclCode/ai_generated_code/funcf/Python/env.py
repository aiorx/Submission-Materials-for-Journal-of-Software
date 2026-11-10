```python
# Crafted with basic coding tools and I edit little bit.
# 가로, 세로, 대각선에 완성된 줄이 있는지를 체크한다 
def check_win(self):
    for i in range(self.n_row):
        for j in range(self.n_col):
            if self.board[i][j] == self.player:
                # horizontal
                if j + 3 < self.n_col and self.board[i][j+1] == self.board[i][j+2] == self.board[i][j+3] == self.player:
                    self.win = self.player
                    self.done = True
                    return
                # vertical
                if i + 3 < self.n_row and self.board[i+1][j] == self.board[i+2][j] == self.board[i+3][j] == self.player:
                    self.win = self.player
                    self.done = True
                    return
                # diagonal (down right)
                if i + 3 < self.n_row and j + 3 < self.n_col and self.board[i+1][j+1] == self.board[i+2][j+2] == self.board[i+3][j+3] == self.player:
                    self.win = self.player
                    self.done = True
                    return
                # diagonal (up right)
                if i - 3 >= 0 and j + 3 < self.n_col and self.board[i-1][j+1] == self.board[i-2][j+2] == self.board[i-3][j+3] == self.player:
                    self.win = self.player
                    self.done = True
                    return

    # no winner
    # 맨 윗줄이 모두 꽉차있다면, 비긴 것
    if not 0 in self.board[0,:]:
        self.win = 3  # 3 means the game is a draw
        self.done = True
```