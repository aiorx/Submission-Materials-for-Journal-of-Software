/**
 * Viacheslav Mikhailov (taleskeeper@yandex.com) © 2025.
 */
package linear.matrix;

import linear.matrix.exception.MatrixException;

import static linear.matrix.ElementaryTransformationUtil.addMultipliedRow;
import static linear.matrix.ElementaryTransformationUtil.swapRows;
import static linear.matrix.MatrixUtil.*;

/**
 * A utility class for row echelon form related calculations.
 * <p>
 * A matrix is in the row echelon form, if it satisfies the following necessary conditions:
 * <ul>
 * <li>The leading entries move progressively to the right.</li>
 * <li>Entries below each leading entry are zero.</li>
 * <li>There are no zero rows, so no violation occurs.</li>
 * </ul>
 *
 * @author Viacheslav Mikhailov
 */
public final class RowEchelonFormUtil {

    private RowEchelonFormUtil() {
        // static context only
    }

    /**
     * Checks if this matrix is a reduced row echelon form matrix, false otherwise.
     *
     * @param matrix given
     * @return true if the given matrix is a reduced row echelon form matrix, false otherwise
     */
    public static boolean isRREF(double[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int prevLeadCol = -1; // Tracks the column index of the previous leading 1

        for (int r = 0; r < rows; r++) {
            // Find the leading 1 in the current row
            int leadCol = -1;
            for (int c = 0; c < cols; c++) {
                if (matrix[r][c] != 0) {
                    leadCol = c;
                    break;
                }
            }

            // Check if the row is all zeros
            if (leadCol == -1) {
                continue; // Skip zero rows
            }

            // Check if the leading entry is 1
            if (matrix[r][leadCol] != 1) {
                return false;
            }

            // Check if the leading 1 is to the right of the previous leading 1
            if (leadCol <= prevLeadCol) {
                return false;
            }

            // Check that all entries above and below the leading 1 are zero
            for (int k = 0; k < rows; k++) {
                if (k != r && matrix[k][leadCol] != 0) {
                    return false;
                }
            }

            prevLeadCol = leadCol; // Update the previous leading column
        }

        return true;
    }

    /**
     * Produces a reduced row echelon form matrix of a given one.
     * This method modifies the given matrix.
     *
     * @param matrix given
     */
    public static void toRREF(double[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int lead = 0; // Tracks the current leading column

        for (int r = 0; r < rows; r++) {
            if (lead >= cols) {
                break;
            }

            // Find the row with the largest element in the current lead column
            int i = r;
            while (matrix[i][lead] == 0) {
                i++;
                if (i == rows) {
                    i = r;
                    lead++;
                    if (lead == cols) {
                        return;
                    }
                }
            }

            // Swap rows to bring the row with the largest element to the current row
            double[] temp = matrix[i];
            matrix[i] = matrix[r];
            matrix[r] = temp;

            // Normalize the current row by dividing by the leading element
            double lv = matrix[r][lead];
            for (int j = 0; j < cols; j++) {
                matrix[r][j] /= lv;
            }

            // Eliminate all other entries in the current column
            for (int k = 0; k < rows; k++) {
                if (k != r) {
                    double factor = matrix[k][lead];
                    for (int j = 0; j < cols; j++) {
                        matrix[k][j] -= factor * matrix[r][j];
                    }
                }
            }

            lead++;
        }
    }

    /**
     * Produces a row echelon form matrix of a given one.
     * This method does not modify the given matrix.
     *
     * @param givenMatrix given
     * @return a new object which is a row echelon form <i>matrix</i> for the original one
     */
    public static double[][] toREF(double[][] givenMatrix) {
        var matrix = MatrixUtil.copy(givenMatrix);
        int rows = matrix.length;
        if (rows == 0)
            return givenMatrix;
        int cols = matrix[0].length;

        int leadRow = 0;
        int leadCol = 0;

        while (leadRow < rows && leadCol < cols) {
            // Find the pivot row (row with the largest absolute value in the current column)
            int pivotRow = leadRow;
            for (int r = leadRow; r < rows; r++) {
                if (Math.abs(matrix[r][leadCol]) > Math.abs(matrix[pivotRow][leadCol])) {
                    pivotRow = r;
                }
            }

            // If the column is all zeros, move to the next column
            if (Math.abs(matrix[pivotRow][leadCol]) < EPS) {
                leadCol++;
                continue;
            }

            // Swap the pivot row with the lead row
            if (pivotRow != leadRow) {
                double[] temp = matrix[leadRow];
                matrix[leadRow] = matrix[pivotRow];
                matrix[pivotRow] = temp;
            }

            // Eliminate all entries below the pivot in the current column
            for (int r = leadRow + 1; r < rows; r++) {
                double factor = matrix[r][leadCol] / matrix[leadRow][leadCol];
                matrix[r][leadCol] = 0.0; // Explicitly set to zero to avoid precision issues
                for (int c = leadCol + 1; c < cols; c++) {
                    matrix[r][c] -= factor * matrix[leadRow][c];
                }
            }

            // Move to the next pivot position
            leadRow++;
            leadCol++;
        }
        MatrixUtil.eliminateEpsilon(matrix);
        return matrix;
    }

    // ===My own below===//

    /**
     * Produces a row echelon form matrix of a given one.
     * This method does not modify the original matrix object.
     *
     * @param matrix given
     * @return a new object which is a row echelon form <i>matrix</i> for the original one
     */
    public static double[][] toRowEchelonForm(final double[][] matrix) throws MatrixException {

        if (matrix.length < 2)
            return matrix;

        if (!Validation.isMatrix(matrix))
            throw new MatrixException("The given matrix doesn't have same amount of columns for every row.");

        int firstNonZeroColumnIndex = -1;

        Outer:
        for (int col = 0; col < matrix[0].length; col++) {
            for (int row = 0; row < matrix.length; row++) {
                if (matrix[row][col] != .0d) {
                    firstNonZeroColumnIndex = col;
                    break Outer;
                }
            }
        }

        // Zero matrix is a row echelon form matrix
        if (firstNonZeroColumnIndex < 0)
            return matrix;

        double[][] result = MatrixUtil.copy(matrix);
        eliminateEpsilon(result);

        // If there are zero rows they must be at the bottom
        for (int row = 0, end = result.length - 1; row <= end; row++) {
            if (isZeroRow(result, row)) {
                result = swapRows(result, row, end--);
            }
        }

        for (int col = firstNonZeroColumnIndex, row = 0; col < result[0].length; ) {

            // if the presumably pivot element is zero, we need to perform Gaussian elimination until it is not
            if (result[row][col] == .0d) {

                // find a non-zero value in this column
                int nonZeroValueRowIndex = -1;
                for (int r = result.length - 1; r >= row; r--) {
                    if (result[r][col] != .0d) {
                        nonZeroValueRowIndex = r;
                        break;
                    }
                }

                // this column consists of zeroes only, we go one step to the right
                if (nonZeroValueRowIndex < 0) {
                    col++;
                    continue;
                }

                result = swapRows(result, row, nonZeroValueRowIndex);
            }

            // All entries below each pivot must be zeroes. The pivot != 0
            if (result[row][col] != .0d) {
                for (int r = row + 1; r < result.length; r++) {
                    if (result[r][col] != .0d) {
                        result = addMultipliedRow(result, r + 1, row + 1, -1 * (result[r][col] / result[row][col]));
                        eliminateEpsilon(result[r]);
                    }
                }
            }

            col++;
            row++;

            if (row == result.length) {
                break;
            }
        }
        if (!isRowEchelonForm(result))
            throw new MatrixException("Failed to bring matrix to the row echelon form.");
        return result;
    }

    /**
     * Checks if this matrix is in the row echelon form.
     *
     * @param matrix given
     * @return true if the matrix is in row echelon form, otherwise false
     * @throws MatrixException if the given matrix is malformed
     */
    public static boolean isRowEchelonForm(double[][] matrix) {
        final int rows = matrix.length;
        final int cols = matrix[0].length;

        // Keeps track of the number of leading zeros in the previous row
        int previousLeadingZeros = -1;

        for (int row = 0; row < rows; row++) {
            int currentLeadingZeros = 0;
            boolean pivotFound = false;

            int col = 0;
            // Count leading zeros in the current row
            for (; col < cols; col++) {
                if (matrix[row][col] == 0) {
                    currentLeadingZeros++;
                } else {
                    pivotFound = true;
                    break;
                }
            }

            // In row echelon form, each pivot must be strictly to the right of the pivot in the row above.
            if (pivotFound && currentLeadingZeros <= previousLeadingZeros) {
                return false;
            }

            // Update the number of leading zeros in the previous row
            previousLeadingZeros = currentLeadingZeros;

        }

        // In row echelon form, all zero rows must be at the bottom.
        int lastZeroRow = Integer.MAX_VALUE;
        for (int row = 0; row < rows; row++) {
            if (isZeroRow(matrix, row))
                lastZeroRow = row;
            else if (row > lastZeroRow)
                return false;
        }

        // In row echelon form, all entries below each pivot must be zeroes.
        int lastPivotRow = -1;
        for (int c = 0; c < cols; c++) {
            boolean pivotFound = false;

            for (int r = lastPivotRow + 1; r < rows; r++) {
                if (matrix[r][c] != 0) {
                    if (pivotFound)
                        return false;
                    else {
                        pivotFound = true;
                        lastPivotRow = r;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Checks if this matrix is a trapezoid.
     * Aided using common development resources.
     *
     * @param matrix - the supposed trapezoid matrix
     * @return true if none of main diagonal's values are zero and values under main
     * diagonal values are all zeroes, otherwise false
     */
    public static boolean isTrapezoidForm(double[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;

        // Keeps track of the number of leading zeros in the previous row
        int previousLeadingZeros = -1;

        for (int i = 0; i < rows; i++) {
            int currentLeadingZeros = 0;

            // Count leading zeros in the current row
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == 0) {
                    currentLeadingZeros++;
                } else {
                    break;
                }
            }

            // Check if the current row has at least as many leading zeros as the previous row
            if (currentLeadingZeros < previousLeadingZeros) {
                return false;
            }

            // Update the number of leading zeros in the previous row
            previousLeadingZeros = currentLeadingZeros;
        }

        return true;
    }
}
