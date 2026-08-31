package edu.guilford;

// game of tic-tac-toe with display at command line
// squares are numbered to let player choose easily
// players take turns, X goes first, filling a row, 
// a column, or a diagonal will win for a player

// Composed with basic coding tools, edited by Ben Marlin

import java.util.Scanner;

class Board {

    // cells will hold plays but are numbered to choose for plays
    private char[] cells;

    public Board() {

        // constructor initializes the board with digits 1 to 9
        cells = new char[9];
        for (int i = 0; i < cells.length; i++) {
            cells[i] = (char) ('1' + i); // adding int to char does the obvious
        }
    }

    public boolean makeMove(char player, char position) {
        int index = position - '1';      // subtracting char when char is digit

            // legal choices             // not occupied   
        if (Character.isDigit(position) && cells[index] != 'X' && cells[index] != 'O') {

            cells[index] = player;       // assign to player
            return true;                 // indicate move was legal
        }
        return false;                    // indicate move was illegal
    }

    // prints current state of the board
    public void display() {
        System.out.println();                           // newline at start of board

        for (int i = 0; i < cells.length; i++) {        // steps through cells
            System.out.print(" " + cells[i] + " ");

            if (i % 3 < 2) {                            // when not at end of line
                System.out.print("|");
            } else if (i / 3 < 2) {                    // end of line and first two lines     
                System.out.println("\n---|---|---");
            }
        }
        System.out.println();                          // newline at end of board
    }

    public boolean isFull() {

        // foreach loop temporarily assigns variable cell to cell[i]
        for (char cell : cells) {
            if (Character.isDigit(cell)) {  // tests whether cell is a number 
                return false;               // if it is, the cell is not occupied
            }
        }
        return true;                        // only reaches this if all cells occupied
    }

    public boolean checkWin(char player) {

        // winning combinations are arrays of arrays...
        int[][] winCombinations = {
            {0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // Rows
            {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // Columns
            {0, 4, 8}, {2, 4, 6}             // Diagonals
        };

        for (int[] combo : winCombinations) {
            if (cells[combo[0]] == player &&      // whole line must match
                cells[combo[1]] == player &&      // player for this to be
                cells[combo[2]] == player) {      // true
                return true;
            }
        }
        return false;   // only gets here if player has no win combo
    }
}

public class TicTacToe {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Board board = new Board();
        char currentPlayer = 'X';   // by convention, X starts

        while (true) {

            // print the board
            board.display();

            // prompt current player
            System.out.print("Player " + currentPlayer + ", enter your move (1-9): ");
            String input = scanner.nextLine();

            // handle inappropriate input
            if (input.length() != 1 || input.charAt(0) < '1' || input.charAt(0) > '9') {
                System.out.println("Invalid input. Please enter a digit from 1 to 9.");
                continue; // Skip the rest of the loop and start the next iteration
            }

            // handle illegal moves - if move was legal, it gets placed there
            if (!board.makeMove(currentPlayer, input.charAt(0))) {
                System.out.println("Invalid move. The cell is already occupied. Try again.");
                continue; // Skip the rest of the loop and start the next iteration
            }

            // check to see if the player just won
            if (board.checkWin(currentPlayer)) {
                board.display();
                System.out.println("Player " + currentPlayer + " wins!");
                break; // Exit the loop
            }

            // check to see if board is full
            if (board.isFull()) {
                board.display();
                System.out.println("The game is a draw!");
                break; // Exit the loop
            }

            // Switch players
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
        }

        scanner.close();
    }
}