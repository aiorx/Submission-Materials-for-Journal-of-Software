/*
    Summer 2025
    This code was Assisted with basic coding tools.
    Purpose is to generate a minefield based on command-line arguments:
        rowCount colCount minefieldDensity
 */

package minesweeper;

import java.util.Random;

public final class MinefieldGenerator {

    private MinefieldGenerator() {
        // Prevent instantiation
    }

    public static void main(String[] args) {
        int rows = Integer.parseInt(args[0]);
        int cols = Integer.parseInt(args[1]);
        float density = Float.parseFloat(args[2]);

        char[][] minefield = generateMinefield(rows, cols, density);
        printMinefield(rows, cols, minefield);
    }

    private static char[][] generateMinefield(int rows, int cols, float density) {
        char[][] field = new char[rows][cols];
        int totalCells = rows * cols;
        int mineCount = Math.round(density * totalCells);
        Random rand = new Random();

        // Initialize all cells as blanks
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                field[r][c] = '.';
            }
        }

        // Randomly place mines
        int placedMines = 0;
        while (placedMines < mineCount) {
            int r = rand.nextInt(rows);
            int c = rand.nextInt(cols);
            if (field[r][c] == '.') {
                field[r][c] = '*';
                placedMines++;
            }
        }

        return field;
    }

    private static void printMinefield(int rows, int cols, char[][] field) {
        System.out.println(rows + " " + cols);
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                System.out.print(field[r][c]);
            }
            System.out.println();
        }
    }
}
