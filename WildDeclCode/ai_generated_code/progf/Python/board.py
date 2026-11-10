"""
This file contains the Board class, which is used to represent the board in the game.

@author: Landon Moceri (with the help of GitHub Copilot)
"""
import pygame

class Board:
    def __init__(self, width, spot_size):
        self.width = width
        self.empty_color = (255, 255, 255)
        self.obstacle_color = (0, 0, 0)
        self.spot_size = spot_size
        
        # Create a 2D array to represent the board
        self.grid = [[' ' for _ in range(self.width)] for _ in range(self.width)]
        self.load_board()

    def load_board(self):
        # Read in the board from board.txt
        f = open("./FinalProject/board.txt", "r")
        for i in range(self.width):
            line = f.readline()
            for j in range(self.width):
                if line[j] == " ":
                    self.fill_position(i, j, 0)
                if line[j] == "-":
                    self.fill_position(i, j, 2)
        
    def draw(self, screen):
        # Draw the board, only the obstacles and empty spaces
        for x in range(self.width):
            for y in range(self.width):
                if self.grid[x][y] == 1:
                    pass
                elif self.grid[x][y] == 2:
                    pygame.draw.rect(screen, self.obstacle_color, (x * self.spot_size, y * self.spot_size, self.spot_size, self.spot_size))
                elif self.grid[x][y] == 3:
                    pass
                else:
                    pygame.draw.rect(screen, self.empty_color, (x * self.spot_size, y * self.spot_size, self.spot_size, self.spot_size))

    def fill_position(self, row, col, value):
        self.grid[row][col] = value
        
    def get_position(self, row, col):
        return self.grid[row][col]

    def reset(self):
        self.grid = [[' ' for _ in range(self.width)] for _ in range(self.width)]
        self.load_board()