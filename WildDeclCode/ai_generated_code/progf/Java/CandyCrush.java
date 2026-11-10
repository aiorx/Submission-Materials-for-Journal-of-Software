import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.util.*;
import java.io.*;

import static java.awt.Color.cyan;
import static java.awt.Color.pink;

public class CandyCrush implements ActionListener {
    public static JFrame frame;
    public final String RC = "⊛"; // for bombs
    public final String SC = "⊙"; // for simple candy
    public final String LC = "ℚ"; // for column bomb candy
    public final String LR = "⊖"; // for row bomb candy
    //final String empty = " ";
    public final Color blue = Color.cyan; // for blue color of font of candy
    public final Color red = Color.red; // for red color of font of candy
    public final Color green = Color.green; // for green color of font of candy
    public final Color pink = Color.pink; // for yellow color of font of candy
    // navy blue = rgb(0,0,128)
    public final Color bg = new Color(0, 0, 0); // for background color of game
    public final Color bg2 = new Color(0, 0, 0);
    public final Color fg = Color.white;
    public final Color selected = new Color(0, 0, 0); // for selected candy
    public final Color hint = Color.gray; // for hint
    MenuBar menuBar; // for menu bar
    Menu fileMenu, helpMenu; // for menu
    MenuItem SaveGame, Help, About, Exit; // for menu items
    JPanel gamePanel, scorePanel, infoPanel, buttonPanel; // for panels
    JLabel scoreLabel, infoLabel; // for labels
    JButton backButton; // for back button
    JButton lastClicked; // for last clicked button
    //JButton emptyButton; // for empty button
    JButton[][] button; // for buttons
    JButton RCButton, SCButton, LCButton, LRButton; // for buttons
    public int score; // for saving score
    public int lci, lcj; // for saving last clicked index
    public int hi, hj, hx, hy; // for saving hint
    ArrayList<JButton> destroy_list; // for saving destroyed candies
    ArrayList<JButton> dest; // for saving destroyed candies of row
    ArrayList<JButton> dest2; // for saving destroyed candies of column
    ArrayList<JButton> dest3; // for saving destroyed candies of RB

    public CandyCrush() { // constructor
        // I am sorry about the amount of code used to build this one class and create buttons, labels etc. but I just haven't found
        // a way to implement these things in a row-saving method :(
        frame = new JFrame("Candy Crush");
        frame.setLocation(360, 0);
        frame.setSize(720, 720);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());
        menuBar = new MenuBar();
        fileMenu = new Menu("File");
        helpMenu = new Menu("Help");
        SaveGame = new MenuItem("Save Game");
        Help = new MenuItem("Help");
        About = new MenuItem("About");
        Exit = new MenuItem("Exit");
        fileMenu.add(SaveGame);
        fileMenu.add(Exit);
        helpMenu.add(Help);
        helpMenu.add(About);
        menuBar.add(fileMenu);
        menuBar.add(helpMenu);
        frame.setMenuBar(menuBar);
        RCButton = new JButton(RC);
        RCButton.setBackground(bg);
        RCButton.setText(RC);
        SCButton = new JButton(SC);
        SCButton.setBackground(bg);
        SCButton.setText(SC);
        LCButton = new JButton(LC);
        LCButton.setBackground(bg);
        LCButton.setText(LC);
        LRButton = new JButton(LR);
        LRButton.setBackground(bg);
        LRButton.setText(LR);
        gamePanel = new JPanel();
        gamePanel.setLayout(new GridLayout(10, 10));
        gamePanel.setBackground(bg);
        gamePanel.setBorder(BorderFactory.createLineBorder(Color.black));
        scorePanel = new JPanel();
        scorePanel.setLayout(new GridLayout(1, 2));
        scorePanel.setBackground(bg);
        scorePanel.setBorder(BorderFactory.createLineBorder(Color.black));
        infoPanel = new JPanel();
        infoPanel.setLayout(new GridLayout(1, 2));
        infoPanel.setBackground(bg);
        infoPanel.setBorder(BorderFactory.createLineBorder(Color.black));
        buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(1, 2));
        buttonPanel.setBackground(bg);
        buttonPanel.setBorder(BorderFactory.createLineBorder(Color.black));
        scoreLabel = new JLabel("Score: " + score);
        scoreLabel.setForeground(fg);
        infoLabel = new JLabel("");
        infoLabel.setForeground(fg);
        backButton = new JButton("Back");
        backButton.setBackground(bg);
        backButton.setForeground(fg);
        backButton.setBorder(BorderFactory.createLineBorder(Color.black));
        scorePanel.add(scoreLabel);
        scorePanel.add(infoLabel);
        infoPanel.add(backButton);
        buttonPanel.add(scorePanel);
        buttonPanel.add(infoPanel);
        frame.add(gamePanel, BorderLayout.CENTER);
        frame.add(buttonPanel, BorderLayout.SOUTH);
        newGame();
        frame.setVisible(true);
        addActionListener(this);
        lastClicked.setForeground(bg);
        dest = new ArrayList<>(); // for saving destroyed candies of row
        dest2 = new ArrayList<>(); // for saving destroyed candies of column
        dest3 = new ArrayList<>(); // for saving destroyed candies of RB
    }

    /**
     * Adds action listeners.
     */
    private void addActionListener(CandyCrush candyCrush) {
        SaveGame.addActionListener(candyCrush);
        Help.addActionListener(candyCrush);
        About.addActionListener(candyCrush);
        Exit.addActionListener(candyCrush);
        backButton.addActionListener(candyCrush);
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                button[i][j].addActionListener(candyCrush);
            }
        }
    }

    /**
     * Game creation and board generation.
     */
    public void newGame() {
        score = 0;
        lastClicked = new JButton();
        lastClicked.setName("null");
        scoreLabel.setText("Score (GET 500 TO WIN): " + score);
        button = new JButton[10][10];
        String[] Candies = {SC};
        Color[] Colors = {cyan, red, green, pink};
        Random rand = new Random();
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                Color newColor;
                String newIcon;
                do {
                    newColor = Colors[rand.nextInt(Colors.length)];
                    newIcon = Candies[rand.nextInt(Candies.length)];
                } while ((i > 0 && newColor.equals(button[i - 1][j].getForeground())) ||
                        (j > 0 && newColor.equals(button[i][j - 1].getForeground())));

                button[i][j] = new JButton(newIcon);
                button[i][j].setBackground(bg2);
                button[i][j].setForeground(newColor);
                button[i][j].setBorder(BorderFactory.createEmptyBorder());
                button[i][j].setName(String.valueOf(i) + j);

                // Set font
                Font font = new Font("Arial", Font.BOLD, 90);
                button[i][j].setFont(font);

                gamePanel.add(button[i][j]);
            }
        }
        destroy_list = new ArrayList<>();
    }


    int getI(JButton b) {
        return Integer.parseInt(b.getName().substring(0, 1));
    }

    int getJ(JButton b) {
        return Integer.parseInt(b.getName().substring(1, 2));
    }

    /**
     * Action listener for most of the code functions.
     */
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == SaveGame) {
            SaveGame();
        } else if (e.getSource() == Help) {
            Help_me();
        } else if (e.getSource() == About) {
            About();
        } else if (e.getSource() == Exit) {
            System.exit(0);
        } else if (e.getSource() == backButton) {
            backButton();
        } else {
            for (int i = 0; i < 10; i++) {
                for (int j = 0; j < 10; j++) {
                    if (e.getSource() == button[i][j]) {
                        win();
                        gameOver();
                        if (!lastClicked.getName().equals("null")) {
                            if (!lastClicked.getName().equals(button[i][j].getName())) {
                                change(lci, lcj, i, j);

                                if (destroy_list.size() > 0) {
                                    if (!destroy_list.contains(button[i][j])) {
                                        destroy_list.add(button[i][j]);
                                    }
                                    if (changeable(i, j, lci, lcj)) {
                                        if (!destroy_list.contains(button[lci][lcj])) {
                                            destroy_list.add(button[lci][lcj]);
                                        }
                                    }
                                    destroy();
                                    scoreLabel.setText("Score (GET 500 TO WIN): " + score);

                                }
                                while (isEmpty()) {
                                    fill();
                                }
                                destroy_list.clear();
                            }
                            deselect(lci, lcj);
                        } else {
                            select(i, j);
                        }
                    }
                }
            }
        }
    }

    /**
     * Handles and saves destructions. (I wanted to create bombs and rockets and stuff like that but I didn't know how, so I scrapped it)
     * Mostly Assisted with basic coding tools / https://chatgpt.com/
     */
    public void destroy() {
        // Remove elements in destroy_list that are in dest, dest2, or dest3
        destroy_list.removeAll(dest);
        destroy_list.removeAll(dest2);
        destroy_list.removeAll(dest3);

        // Remove elements in dest and dest2 that are also in dest3
        dest.removeAll(dest3);
        dest2.removeAll(dest3);

        // Process each item in destroy_list
        while (!destroy_list.isEmpty()) {
            JButton currentButton = destroy_list.get(0);
            if (currentButton.getText().equals(SCButton.getText())) {
                // Handle SCButton case
                score += 5;
                button[getI(currentButton)][getJ(currentButton)].setText(" ");
                button[getI(currentButton)][getJ(currentButton)].setForeground(bg);
            } else if (currentButton.getText().equals(RCButton.getText())) {
                // Handle RCButton case
                button[getI(currentButton)][getJ(currentButton)].setText(SC);
                for (int i = -1; i < 2; i++) {
                    for (int j = -1; j < 2; j++) {
                        try {
                            destroy_list.add(button[getI(currentButton) + i][getJ(currentButton) + j]);
                        } catch (Exception ignored) {
                        }
                    }
                }
                score += 20;
            } else if (currentButton.getText().equals(LCButton.getText())) {
                // Handle LCButton case
                button[getI(currentButton)][getJ(currentButton)].setText(SC);
                for (int i = 0; i < 10; i++) {
                    try {
                        destroy_list.add(button[i][getJ(currentButton)]);
                    } catch (Exception ignored) {
                        // Handle out of bounds
                    }
                }
                score += 10;
            } else if (currentButton.getText().equals(LRButton.getText())) {
                // Handle LRButton case
                button[getI(currentButton)][getJ(currentButton)].setText(SC);
                for (int j = 0; j < 10; j++) {
                    try {
                        destroy_list.add(button[getI(currentButton)][j]);
                    } catch (Exception ignored) {
                        // Handle out of bounds
                    }
                }
                score += 10;
            }

            // Update score label and remove processed button from destroy_list
            scoreLabel.setText("Score (GET 500 TO WIN): " + score);
            destroy_list.remove(0);
        }
    }

    /**
     * About button.
     */
    public void About() {
        JOptionPane.showMessageDialog(null, """
                Candy Crush

                Version: alpha 1.1
                Author: Jan Kouba
                """);
    }
    /*
    public void uh() {
        if (hi == -12) {
            return;
        }
        try {
            button[hi][hj].setBackground(bg2);
            button[hx][hy].setBackground(bg2);
        } catch (Exception e) {
            System.out.println("");
        }
        hi = -12;
        hj = -12;
        hx = -12;
        hy = -12;

    }
     */

    /**
     * Hint method.
     */
    public void Help_me() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                try {
                    if (changeable(i, j, i + 1, j)) {
                        button[i][j].setBackground(hint);
                        button[i + 1][j].setBackground(hint);
                        hi = i;
                        hj = j;
                        hx = i + 1;
                        hy = j;
                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i + 1, j, i, j)) {
                        button[i][j].setBackground(hint);
                        button[i + 1][j].setBackground(hint);
                        hi = i + 1;
                        hj = j;
                        hx = i;
                        hy = j;
                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i, j + 1, i, j)) {
                        button[i][j].setBackground(hint);
                        button[i][j + 1].setBackground(hint);
                        hi = i;
                        hj = j + 1;
                        hx = i;
                        hy = j;
                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i, j, i, j + 1)) {
                        button[i][j].setBackground(hint);
                        button[i][j + 1].setBackground(hint);
                        hi = i;
                        hj = j;
                        hx = i;
                        hy = j + 1;
                        return;
                    }
                } catch (Exception e) {
                }
            }
        }
    }

    /**
     * Sets when the game ends (Not by score) Basically the board runs out of moves to play
     */
    public void gameOver() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                try {
                    if (changeable(i, j, i + 1, j)) {

                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i + 1, j, i, j)) {
                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i, j + 1, i, j)) {
                        return;
                    }
                } catch (Exception e) {
                }
                try {
                    if (changeable(i, j, i, j + 1)) {
                        return;
                    }
                } catch (Exception e) {
                }
            }
        }

        JOptionPane.showMessageDialog(null, "Game Over");

    }

    /**
     * Button on the bottom right hand corner of the screen when playing (Puts you back in the menu)
     */
    public void backButton() {
        new HomePage();
        CandyCrush.frame.setVisible(false);
    }

    /**
     * This is a method used to save the game. It is done by encoding the colours into letters and then CSV file (This is later used to load the game
     * by reading the letters from the CSV file and spawning the buttons according to the letters)
     */
    public void SaveGame() {
        StringBuilder text = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                String candyText = button[i][j].getText();
                String candyColor = "";
                Color foregroundColor = button[i][j].getForeground();

                // Determine candy color based on foreground color
                if (foregroundColor.equals(Color.RED)) {
                    candyColor = "R";
                } else if (foregroundColor.equals(Color.CYAN)) {
                    candyColor = "C";
                } else if (foregroundColor.equals(Color.GREEN)) {
                    candyColor = "L";
                } else if (foregroundColor.equals(Color.PINK)) {
                    candyColor = "Y";
                }

                // Append candy type and color to text
                switch (candyText) {
                    case RC:
                        text.append("RC");
                        break;
                    case LC:
                        text.append("LC");
                        break;
                    case LR:
                        text.append("LR");
                        break;
                    case SC:
                        text.append("SC");
                        break;
                    default:
                        text.append("  ");
                        break; // Empty space for non-candy cells
                }

                // Append candy color
                text.append(candyColor);

                if (j != 9) {
                    text.append(",");
                }
            }
            text.append("\n");
        }

        try {
            FileWriter fw = new FileWriter("CandyCrush.csv");
            fw.write(text.toString());
            fw.close();

            // Show dialog box
            JOptionPane.showMessageDialog(null, "Game Saved");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Finally the load method. This method first uses a fileChooser, so you can find the saved CandyCrush.csv file to import. After that everything is
     * read and stored into a text variable and splits it into lines with regex and reads them to set the text (again used for saving and loading) and the colour resulting
     * in the loaded save file.
     */
    public void LoadGame() {
        JFileChooser fileChooser = new JFileChooser();
        int result = fileChooser.showOpenDialog(null);

        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            try (Scanner sc = new Scanner(selectedFile)) {
                // Clear existing game board
                clearBoard();

                int row = 0;
                while (sc.hasNextLine() && row < 10) {
                    String line = sc.nextLine();
                    String[] values = line.split(",");
                    for (int col = 0; col < values.length && col < 10; col++) {
                        String next = values[col].trim();
                        if (next.length() >= 3) { // Check if the string is long enough
                            String no = next.substring(0, 2);
                            String color = next.substring(2, 3);

                            switch (no) {
                                case "RC":
                                    button[row][col].setText(RC);
                                    break;
                                case "LC":
                                    button[row][col].setText(LC);
                                    break;
                                case "LR":
                                    button[row][col].setText(LR);
                                    break;
                                case "SC":
                                    button[row][col].setText(SC);
                                    break;
                                default:
                                    button[row][col].setText("");
                                    break; // Empty text for non-candy cells
                            }

                            switch (color) {
                                case "R":
                                    button[row][col].setForeground(Color.RED);
                                    break;
                                case "C":
                                    button[row][col].setForeground(Color.CYAN);
                                    break;
                                case "L":
                                    button[row][col].setForeground(Color.GREEN);
                                    break;
                                case "Y":
                                    button[row][col].setForeground(Color.PINK);
                                    break;
                                default:
                                    button[row][col].setForeground(Color.BLACK);
                                    break; // Default color
                            }

                            button[row][col].setBackground(bg);
                            button[row][col].setName(String.valueOf(row) + col);
                        }
                    }
                    row++;
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }
    }


    // Helper method to clear the game board
    private void clearBoard() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                button[i][j].setText("");
                button[i][j].setBackground(bg);
                button[i][j].setForeground(Color.BLACK);
                button[i][j].setName("");
            }
        }
    }

    /**
     * Saves clicked buttons (candies) and selects it
     */
    public void select(int i, int j) {
        lci = i;
        lcj = j;
        lastClicked.setName(button[i][j].getName());
        try {
            button[i][j].setBackground(selected);
        } catch (Exception ignored) {
        }
    }

    /**
     * Deselects :p
     */
    public void deselect(int i, int j) {
        try {
            button[i][j].setBackground(bg);
            lastClicked.setName("null");
        } catch (Exception e) {
            lastClicked.setName("null");
        }
    }

    /**
     * Winning condition if the score is over selected amount in the if condition you win.
     */
    public void win() {
        if (score >= 100) {
            JOptionPane.showMessageDialog(null, "You Win 😎");
            new Menu();
            frame.dispose();
        }
    }

    /**
     * i j first button coordinates and x y second button coordinates
     */
    public boolean changeable(int i, int j, int x, int y) {
        //So its not the same
        int i1 = Math.abs(i - x) + Math.abs(j - y);
        if ((i1 > 1) || (i1 == 0)) {
            return false;
        }
        if (same(i, j, x, y))
            return false;
        int count = 0;
        if (i == x) {
            int k = y - j;

            for (int l = 1; l < 3; l++) {
                try {
                    if (same(i, j, x, y + k * l)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        break;
                    }
                } catch (Exception ignored) {
                }
            }
            count = 0;
            for (int l = 1; true; l++) {
                try {
                    if (same(i, j, i + l, y)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    break;
                }
            }

            for (int l = 1; l < 3; l++) {
                try {
                    if (same(i, j, i - l, y)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    count = 0;
                }
            }
        }
        count = 0;
        if (j == y) {
            int k = x - i;

            for (int l = 1; true; l++) {
                try {
                    if (same(i, j, x + k * l, y)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        count = 0;
                        break;
                    }
                } catch (Exception e) {
                    count = 0;
                    break;
                }
            }
            for (int l = 1; true; l++) {
                try {
                    if (same(i, j, x, y + l)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    break;
                }
            }
            for (int l = 1; true; l++) {
                try {
                    if (same(i, j, x, y - l)) {
                        count++;
                        if (count > 1) {
                            return true;
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    break;
                }

            }
        }
        return false;
    }

    /**
     * Adds to destroy list.
     */
    public void addToDestroyList(ArrayList<String> a) {
        for (String s : a) {
            int b = s.charAt(0) - '0';
            int c = s.charAt(2) - '0';
            // if not in destroy list add to it
            if (!destroy_list.contains(button[b][c])) {
                destroy_list.add(button[b][c]);
            }
        }
    }

    public boolean same(int i, int j, int x, int y) {
        return button[i][j].getForeground() == button[x][y].getForeground();
    }

    /**
     * Changes list.
     * Also, with the help of ChatGPT / https://chatgpt.com/
     */
    public void changeslist(int i, int j, int x, int y) {
        int i1 = Math.abs(i - x) + Math.abs(j - y);
        if (i1 > 1 || i1 == 0) {
            return;
        }
        int count = 0;
        ArrayList<String> list = new ArrayList<>();
        if (i == x) {
            int k = y - j;

            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, x, y + k * l)) {
                        count++;
                        list.add(i + "," + (y + k * l));
                        if (count > 1) {
                            addToDestroyList(list);
                            if (count == 3) {
                                dest.add(button[x][y]);
                            }
                            if (count == 4) {
                                // remove last index in dest
                                dest3.add(button[x][y]);

                            }
                        }
                    } else {
                        list.clear();
                        break;
                    }
                } catch (Exception e) {
                    if (count > 1) {
                        break;
                    }
                }
            }
            count = 0;
            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, i + l, y)) {
                        list.add((i + l) + "," + y);
                        count++;
                        if (count > 1) {
                            addToDestroyList(list);
                            if (count == 3) {
                                dest2.add(button[x][y]);
                            }
                            if (count == 4) {

                                dest3.add(button[x][y]);

                            }
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    break;
                }
            }

            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, i - l, y)) {
                        list.add((i - l) + "," + y);
                        count++;
                        if (count > 1) {
                            addToDestroyList(list);
                            if (count == 3) {
                                dest2.add(button[x][y]);
                            }
                            if (count == 4) {

                                dest3.add(button[x][y]);

                            }
                        }
                    } else {
                        list.clear();
                        break;
                    }
                } catch (Exception e) {
                    list.clear();
                    break;
                }
            }
        }
        count = 0;
        if (j == y) {
            int k = x - i;

            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, x + k * l, y)) {
                        list.add((x + k * l) + "," + y);
                        count++;
                        if (count > 1) {
                            addToDestroyList(list);
                            if (count == 3) {
                                dest2.add(button[x][y]);
                            }
                            if (count == 4) {

                                dest3.add(button[x][y]);

                            }
                        }
                    } else {
                        list.clear();
                        break;
                    }
                } catch (Exception e) {
                    list.clear();
                    break;
                }
            }
            count = 0;
            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, x, y + l)) {
                        list.add(x + "," + (y + l));
                        count++;
                        if (count > 1) {
                            addToDestroyList(list);
                            if (count == 3) {
                                dest.add(button[x][y]);
                            }
                            if (count == 4) {

                                dest3.add(button[x][y]);

                            }
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    break;
                }
            }
            for (int l = 1; l < 10; l++) {
                try {
                    if (same(i, j, x, y - l)) {
                        list.add(x + "," + (y - l));
                        count++;
                        if (count > 1) {
                            if (count == 3) {
                                dest.add(button[x][y]);
                            }
                            if (count == 4) {

                                dest3.add(button[x][y]);

                            }
                            addToDestroyList(list);
                        }
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    if (count > 1) {
                        addToDestroyList(list);
                    }
                    list.clear();
                    break;
                }

            }
        }
        // print everything in the destroy list
        for (JButton jButton : dest3) {
            System.out.println(jButton.getText());
        }
    }

    /**
     * Does exactly what it implies.
     */
    public void change(int i, int j, int x, int y) {
        if (!(changeable(i, j, x, y) || changeable(x, y, i, j))) {
            deselect(i, j);
        } else {
            changeslist(i, j, x, y);
            changeslist(x, y, i, j);
            lastClicked.setName("null");
            JButton temp1 = new JButton();
            temp1.setText(button[i][j].getText());
            temp1.setForeground(button[i][j].getForeground());
            button[i][j].setText(button[x][y].getText());
            button[i][j].setForeground(button[x][y].getForeground());
            button[x][y].setText(temp1.getText());
            button[x][y].setForeground(temp1.getForeground());

        }
    }

    public void simpleChange(int i, int j, int x, int y) {
        JButton temp1 = new JButton();
        temp1.setText(button[i][j].getText());
        temp1.setForeground(button[i][j].getForeground());
        button[i][j].setText(button[x][y].getText());
        button[i][j].setForeground(button[x][y].getForeground());
        button[x][y].setText(temp1.getText());
        button[x][y].setForeground(temp1.getForeground());
    }

    /**
     * Random candies.
     */
    public void randomCandy(int i, int j, String name) {
        Random rand1 = new Random();
        // String[] Candies = { SC };
        Color[] Colors = {cyan, red, green, pink};
        // int x = rand.nextInt(Candies.length);
        int y = rand1.nextInt(Colors.length);
        button[i][j].setText(name);
        button[i][j].setForeground(Colors[y]);
    }

    /**
     * Fills the board after candies have popped
     */
    public void fill() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                if (button[i][j].getForeground().equals(lastClicked.getForeground())) {
                    if (i == 0) {
                        randomCandy(i, j, SC);
                        button[i][j].setBackground(bg);
                    } else if (!button[i - 1][j].getForeground().equals(lastClicked.getForeground())) {
                        simpleChange(i, j, i - 1, j);
                        button[i][j].setBackground(bg);
                    }
                }
            }
        }
    }

    /**
     * Checks if the board is not fully filled and fills it.
     */
    public boolean isEmpty() {
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                if (button[i][j].getForeground().equals(lastClicked.getForeground())) {
                    return true;
                }
            }
        }
        return false;
    }
}