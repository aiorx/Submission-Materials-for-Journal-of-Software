package supertetris.blocks;

import java.awt.Graphics;
import javax.swing.JPanel;
import supertetris.ui.Drawable;

/**
 * This class represents a matrix made of blocks for tetris, it can be used to make the blocks and the board.
 * @author Andre Benquerer - n° 24633 
 */
public class BlockMatrix extends JPanel implements Drawable {

    //Given by professor Manso
    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        draw(g, 0, 0, getWidth(), getHeight());
    }
    
    //Given by professor Manso
    @Override
    public void draw(Graphics gr, int px, int py, int width, int height) {
        int sizeX = width / getColumms();
        int sizeY = height / getLines();
        for (int y = 0; y < getLines(); y++) {
            for (int x = 0; x < getColumms(); x++) {
                matrix[y][x].draw(gr, px + x * sizeX, py + y * sizeY, sizeX, sizeY);
            }
        }
    }

    /**
     * Attribute "matrix" represents a matrix made with blocks from the class Block
     */
    protected Block[][] matrix;

    /**
     * constructor with parameters with a strong relation (aggregation) the
     * constructor makes a clone of the parameters
     *
     * @param matrix original blocks
     */
    public BlockMatrix(Block[][] matrix) {
        //dimensions of the original matrix
        int lines = matrix.length;
        int cols = matrix[0].length;

        // initialize array
        this.matrix = new Block[lines][cols];
        //clone all blocks
        for (int y = 0; y < lines; y++) {
            for (int x = 0; x < cols; x++) {
                //calls get clone of each block
                this.matrix[y][x] = matrix[y][x].getClone();
            }
        }
    }

    /**
     * Constructor with another matrix as a parameter (copy)
     *
     * @param original matrix to be used as model
     */
    public BlockMatrix(BlockMatrix original) {
        this(original.matrix);
    }

    /**
     * Constructor for creating a 1x1 matrix with a empty block
     */
    public BlockMatrix() {
        this(new Block[][]{{new Empty()}});
    }

    /**
     * @return returns the matrix
     */
    public Block[][] getMatrix() {
        return matrix;
    }

    /**
     * @return returns the amount of lines of the matrix (matrix length);
     */
    public int getLines() {
        return matrix.length;
    }

    /**
     * @return returns the amount of columns of the matrix (array length of the
     * first line of the matrix);
     */
    public int getColumms() {
        return matrix[0].length;
    }

    /**
     * @return returns drawn version of the matrix (string)
     */
    @Override
    public String toString() {
        //DEVERIA UTILIZAR O STRINGBLUIDER;
        String txt = "";
        for (Block[] blocks : matrix) {
            for (Block block : blocks) {
                txt += block.toString();
            }
            txt += "\n";
        }
        return txt;
    }

    /**
     * @return returns a clone of the object
     */
    public BlockMatrix getClone() {
        return new BlockMatrix(this);
    }

    /**
     * rotates a matrix as it would be rotated in a tetris game
     */
    public void rotate() {
        this.matrix = rotateMatrix(matrix);
    }

    /**
     * Function for rotation a matrix as if it was a piece of a tetris game by
     * transposing it
     *
     * Supported via standard programming aids
     *
     * @param matriz
     * @return returns the rotated matrix
     */
    private static Block[][] rotateMatrix(Block[][] matriz) {
        // Cria uma nova matriz transposta com as dimensões invertidas
        Block[][] transposta = new Block[matriz[0].length][matriz.length];
        for (int y = 0; y < matriz.length; y++) {
            for (int x = 0; x < matriz[y].length; x++) {
                transposta[x][matriz.length - y - 1] = matriz[y][x];
            }
        }

        return transposta;
    }
}
