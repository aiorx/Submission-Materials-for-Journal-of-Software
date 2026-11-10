import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import javax.swing.*;
import java.awt.*;
import java.util.Arrays;
import java.util.HashSet;

public class Day16
{
    private static int width = 0;
    private static int start = 0;
    private static int end = 0;
    private static char[] map;
    private static long[] distance;
    private static MatrixGUI gui;

    public static enum Direction
    {
        NORTH(-width, "north"), EAST(1, "east"), SOUTH(width, "south"), WEST(-1, "west");
        final int offset;
        final String name;

        Direction(int offset, String name)
        {
            this.offset = offset;
            this.name = name;
        }
    }

    public static Direction getNext(Direction direction)
    {
        Direction[] values = Direction.values();
        int ordinal = direction.ordinal();
        return values[(ordinal + 1) % values.length];
    }

    public static Direction getPrevious(Direction direction)
    {
        Direction[] values = Direction.values();
        int ordinal = direction.ordinal();
        return values[(ordinal - 1 + values.length) % values.length];
    }


    public static void main(String[] args)
    {
//        gui = new MatrixGUI();

        readMap();
        distance = new long[map.length];
        for (int i = 0; i < distance.length; i++) distance[i] = Long.MAX_VALUE;

        HashSet<Integer> path = new HashSet<>();
        long score = race(start, Direction.EAST, 0, path);
        System.out.println(score +", " + path.size());
//        gui.markPath(path);
    }

    public static long race(int position, Direction direction, long score, HashSet<Integer> path)
    {
        path.add(position);
//        System.out.printf("Pos: %d Score: %d Direction: %s%n", position, score, direction.name);
        if (position == end) {
            System.out.println("End: " + score);
            return score;
        } else {
            char type = map[position];
            if (type == '#' || score - 1001 > distance[position] || score >= distance[end]) return Long.MAX_VALUE;

            distance[position] = score;
//            gui.update(position, score);
            HashSet<Integer> forwardPath = new HashSet<>();
            HashSet<Integer> leftPath = new HashSet<>();
            HashSet<Integer> rightPath = new HashSet<>();

            long forward = race(position + direction.offset, direction, score + 1, forwardPath);
            long left = race(position + getPrevious(direction).offset, getPrevious(direction), score + 1001, leftPath);
            long right = race(position + getNext(direction).offset, getNext(direction), score + 1001, rightPath);

            long lowestScore = Math.min(Math.min(left, right), forward);

            if (forward == lowestScore) {
                path.addAll(forwardPath);
            }
            if (left == lowestScore) {
                path.addAll(leftPath);
            }
            if (right == lowestScore) {
                path.addAll(rightPath);
            }
            return lowestScore;
        }
    }

    /**
     * Generated from Day 13 Composed with GitHub coding tools
     */
    private static void readMap()
    {
        StringBuilder mapString = new StringBuilder();

        InputStream stream = Day15.class.getResourceAsStream("puzzle/day16.txt");
        if (stream == null)
        {
            System.err.println("File not found");
            return;
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream)))
        {
            String line;
            int row = 0;

            while ((line = reader.readLine()) != null) {
                if (line.indexOf('S') != -1) {
                    width = line.trim().length();
                    start = line.indexOf('S') + row * width;
                }
                if (line.indexOf('E') != -1) {
                    width = line.trim().length();
                    end = line.indexOf('E') + row * width;
                }
                mapString.append(line.trim());
                row++;
            }
        } catch (IOException e)
        {
            throw new RuntimeException(e);
        }

        map = mapString.toString().toCharArray();
    }


    public static class MatrixGUI extends JFrame {

        private static final int ROWS = 15;
        private static final int COLS = 15;
        private static final long EMPTY_CELL = Long.MAX_VALUE;

        private long[][] matrix = new long[ROWS][COLS];
        private JTextField[][] textFields = new JTextField[ROWS][COLS];

        public MatrixGUI() {
            super("Matrix");
            setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

            // Initialize matrix with empty cells
            for (int i = 0; i < ROWS; i++) {
                Arrays.fill(matrix[i], EMPTY_CELL);
            }

            // Create GUI components
            JPanel panel = new JPanel(new GridLayout(ROWS, COLS));
            for (int row = 0; row < ROWS; row++) {
                for (int col = 0; col < COLS; col++) {
                    textFields[row][col] = new JTextField(3);
                    textFields[row][col].setEditable(false);
                    textFields[row][col].setText("");
                    panel.add(textFields[row][col]);
                }
            }

            // Add components to the frame
            getContentPane().setLayout(new BorderLayout());
            getContentPane().add(panel, BorderLayout.CENTER);

            pack();
            setVisible(true);
        }

        public void update(int position, long value){
            int row = position / COLS;
            int col = position % COLS;

            if (row >= 0 && row < ROWS && col >= 0 && col < COLS)
            {
                matrix[row][col] = value;
                textFields[row][col].setText(value != EMPTY_CELL ? String.valueOf(value) : "");
            }
        }

        public void markPath(HashSet<Integer> path)
        {
            for (int position : path) {
                int row = position / COLS;
                int col = position % COLS;

                if (row >= 0 && row < ROWS && col >= 0 && col < COLS)
                {
//                    matrix[row][col] = value;
                    textFields[row][col].setForeground(Color.RED);
                }
            }
        }
    }
}
