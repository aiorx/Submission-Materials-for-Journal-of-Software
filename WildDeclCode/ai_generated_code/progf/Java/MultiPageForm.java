import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

// Code below is Adapted from standard coding samples

public class MultiPageForm{
    private JFrame frame;
    private CardLayout cardLayout;
    private JPanel mainPanel;
    private JPanel[] pagesPanel;
    MIDI midi;
    JustSound justSound;
    int timerCount;
    String songsListFileName = "songsList.txt";
    int selected1, selected2;
    private JButton playButton, playButton2;
    private ActionListener playMusicListener;
    // Shared data
    private JComboBox<String> comboBoxPage1;
    private JCheckBox[][] checkBoxMatrixPage2;
    private JComboBox<String> comboBoxPage3;
    private JCheckBox[][] checkBoxMatrixPage4;
    private ResultsPage resultsPage;

    public MultiPageForm() {
        midi = new MIDI();
        midi.readSongsList(songsListFileName);
        selected1 = -1;
        selected2 = -1;
        pagesPanel = new JPanel[4];
        justSound = new JustSound();
        timerCount = 0;
        playMusicListener = new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                Object source = e.getSource();
                if(source.equals(playButton)) {
                    for (timerCount = 0; timerCount < midi.getTimeSlots(); timerCount++) {
                        //justSound.makeMelody(midi.getInputMelody1(), midi, timerCount);
                        try {
                            justSound.makeMelody(checkBoxMatrixPage2,midi,timerCount);
                        } catch (InterruptedException ex) {
                            throw new RuntimeException(ex);
                        }
                    }
                } else if(source.equals(playButton2)) {
                    for(timerCount = 0; timerCount < midi.getTimeSlots(); timerCount++) {
                        //justSound.makeMelody(midi.getInputMelody2(), midi,timerCount);
                        try {
                            justSound.makeMelody(checkBoxMatrixPage4,midi,timerCount);
                        } catch (InterruptedException ex) {
                            throw new RuntimeException(ex);
                        }
                    }
                }
            }
        };
    }
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MultiPageForm().createAndShowGUI());
    }

    private void createAndShowGUI() {
        frame = new JFrame("Multi-Page Form");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1200, 800);

        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        pagesPanel[0] = createPage1();
        mainPanel.add(pagesPanel[0],"Page1");
        pagesPanel[1] = createPage2();
        mainPanel.add(pagesPanel[1],"Page2");
        pagesPanel[2] = createPage3();
        mainPanel.add(pagesPanel[2],"Page3");
        pagesPanel[3] =createPage4();
        mainPanel.add(pagesPanel[3],"Page4");
        frame.add(mainPanel);
        frame.setVisible(true);
    }

    // Page 1: Dropdown
    private JPanel createPage1() {
        JPanel panel = new JPanel(new BorderLayout());
        JLabel label = new JLabel("Select a first melody from the dropdown:");
        comboBoxPage1 = new JComboBox<>(midi.getSongNames());
        panel.add(label, BorderLayout.NORTH);
        panel.add(comboBoxPage1, BorderLayout.CENTER);
        panel.add(createNavPanel(null, "Page2", false), BorderLayout.SOUTH);
        return panel;
    }

    // Page 2: 7x64 checkbox matrix with row highlight
    private JPanel createPage2() {
        checkBoxMatrixPage2 = new JCheckBox[midi.getScaleLen()][midi.getTimeSlots()];
        JPanel panel = new JPanel(new BorderLayout());
        JPanel grid = createCheckboxMatrix(checkBoxMatrixPage2);
        playButton = new JButton("Play Melody");
        playButton.addActionListener(playMusicListener);
        panel.add(playButton, BorderLayout.WEST);
        panel.add(new JScrollPane(grid), BorderLayout.CENTER);
        panel.add(createNavPanel("Page1", "Page3", false), BorderLayout.SOUTH);
        return panel;
    }

    // Page 3: 7x10 dropdown matrix
    private JPanel createPage3() {
        JPanel panel = new JPanel(new BorderLayout());
        JLabel label = new JLabel("Select second melody from the dropdown:");
        comboBoxPage3 = new JComboBox<>(midi.getSongNames());
        panel.add(label, BorderLayout.NORTH);
        panel.add(comboBoxPage3, BorderLayout.CENTER);
        panel.add(createNavPanel(null, "Page4", false), BorderLayout.SOUTH);
        return panel;
    }

    // Page 4: Final 7x64 checkbox matrix with submit button
    private JPanel createPage4() {
        checkBoxMatrixPage4 = new JCheckBox[midi.getScaleLen()][midi.getTimeSlots()];
        JPanel panel = new JPanel(new BorderLayout());
        JPanel grid = createCheckboxMatrix(checkBoxMatrixPage4);
        playButton2 = new JButton("Play Melody");
        playButton2.addActionListener(playMusicListener);
        panel.add(playButton2, BorderLayout.WEST);
        panel.add(createNavPanel("Page3", null, true), BorderLayout.SOUTH);
        panel.add(new JScrollPane(grid), BorderLayout.CENTER);
        return panel;
    }

    private JPanel createNavPanel(String backPage, String nextPage, boolean showSubmit) {
        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));

        if (backPage != null) {
            JButton back = new JButton("Back");
            back.addActionListener(e -> {
                cardLayout.show(mainPanel, backPage);
            });
            navPanel.add(back);
        }
        if (nextPage != null) {
            JButton next = new JButton("Next");
            next.addActionListener(e -> {
                if(nextPage.equals("Page2")) {
                    selected1 = comboBoxPage1.getSelectedIndex();
                    System.out.println("Page 1 Combo item "+selected1+" selected");
                    String selectedFile1 = midi.getMIDIFileName(selected1);
                    System.out.println("Selected song file "+selectedFile1);
                    midi.readTextFile(selectedFile1, 0);
                    initMatrix(midi.getInputMelody1(),checkBoxMatrixPage2);
                } else if(nextPage.equals("Page4")) {
                    selected2 = comboBoxPage3.getSelectedIndex();
                    String selectedFile2 = midi.getMIDIFileName(selected2);
                    midi.readTextFile(selectedFile2,1);
                    initMatrix(midi.getInputMelody2(),checkBoxMatrixPage4);
                    System.out.println("Selected song file "+selectedFile2);
                }
                cardLayout.show(mainPanel, nextPage);
            });
            navPanel.add(next);
        }
        if (showSubmit) {
            JButton submit = new JButton("Submit");
            submit.addActionListener(this::handleSubmit);
            navPanel.add(submit);
        }
        // You could add logic like validation or storing to a database
        return navPanel;
    }

    // Create a 7x64 checkbox matrix with row highlighting
    private JPanel createCheckboxMatrix(JCheckBox[][] checkBoxes) {
        JPanel panel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        Color[] rowColors = {
                new Color(255, 230, 230),
                new Color(230, 255, 230),
                new Color(230, 230, 255),
                new Color(255, 255, 230),
                new Color(230, 255, 255),
                new Color(255, 230, 255),
                new Color(240, 240, 240)
        };

        // Top-left empty corner
        gbc.gridx = 0;
        gbc.gridy = 0;
        panel.add(new JLabel(""), gbc);

        // Column labels
        for (int col = 0; col < 64; col++) {
            gbc.gridx = col + 1;
            gbc.gridy = 0;
            JLabel colLabel = new JLabel(Integer.toString(col), SwingConstants.CENTER);
            colLabel.setFont(new Font("Arial", Font.PLAIN, 10));
            panel.add(colLabel, gbc);
        }

        // Matrix
        for (int row = 0; row < 7; row++) {
            gbc.gridy = row + 1;
            gbc.gridx = 0;
            char rowName = (char) ('C'+ (char)row);
            if(rowName == 'H') {
                rowName = 'A';
            } else if(rowName == 'I') {
                rowName = 'B';
            }
            JLabel rowLabel = new JLabel(String.valueOf(rowName), SwingConstants.CENTER);
            panel.add(rowLabel, gbc);

            for (int col = 0; col < 64; col++) {
                checkBoxes[row][col] = new JCheckBox();
                JPanel wrapper = new JPanel(new BorderLayout());
                wrapper.add(checkBoxes[row][col], BorderLayout.CENTER);
                wrapper.setOpaque(true);
                wrapper.setBackground(Color.WHITE);

                int finalRow = row;
                checkBoxes[row][col].addItemListener(e -> updateRowHighlight(checkBoxes, rowColors, finalRow, panel));

                gbc.gridx = col + 1;
                panel.add(wrapper, gbc);
            }
        }

        return panel;
    }

    // Row highlighter
    private void updateRowHighlight(JCheckBox[][] checkBoxes, Color[] rowColors, int row, JPanel panel) {
        boolean anySelected = false;
        for (int col = 0; col < checkBoxes[row].length; col++) {
            if (checkBoxes[row][col].isSelected()) {
                anySelected = true;
                break;
            }
        }

        Component[] components = panel.getComponents();
        for (Component comp : components) {
            GridBagConstraints gbc = ((GridBagLayout) panel.getLayout()).getConstraints(comp);
            if (gbc.gridy == row + 1 && gbc.gridx > 0) {
                comp.setBackground(anySelected ? rowColors[row] : Color.WHITE);
            }
        }
    }

    // Submission handler
    private void handleSubmit(ActionEvent e) {
        /*StringBuilder result = new StringBuilder("<html><h2>Submission Summary:</h2>");

        result.append("<b>Page 1 Dropdown:</b> ").append(comboBoxPage1.getSelectedItem()).append("<br><br>");

        result.append("<b>Page 2 Checkboxes:</b><br>");
        result.append(getCheckboxSelections(checkBoxMatrixPage2));

        result.append("<br><b>Page 3 Dropdown Matrix:</b><br>");
        result.append(comboBoxPage3.getSelectedItem()).append(" ");

               result.append("<br><b>Page 4 Checkboxes:</b><br>");
        result.append(getCheckboxSelections(checkBoxMatrixPage4));
        result.append("</html>");

         */
        midi.setMelodyFromPage(0, checkBoxMatrixPage2);
        midi.setMelodyFromPage(1,checkBoxMatrixPage4);
        midi.interweave();
        // Show result in a new window
        JFrame resultFrame = new JFrame("Results Page");
        resultFrame.setSize(1400, 600);
        resultsPage = new ResultsPage(midi, justSound, frame);
        resultsPage.setMelodyColors(midi);
        resultFrame.add(resultsPage);
        resultFrame.setVisible(true);
        frame.setVisible(false); // Hide main window
    }

    // Helper to get checkbox matrix selection
    private String getCheckboxSelections(JCheckBox[][] checkBoxes) {
        StringBuilder sb = new StringBuilder();
        for (int row = 0; row < checkBoxes.length; row++) {
            for (int col = 0; col < checkBoxes[0].length; col++) {
                if (checkBoxes[row][col].isSelected()) {
                    sb.append("Row ").append(row).append(", Col ").append(col).append("<br>");
                }
            }
        }
        return sb.toString();
    }
    private void initMatrix(boolean[][] melodyMatrix, JCheckBox[][] webMatrix) {
        if(melodyMatrix == null || webMatrix == null) {
            return;
        }
        for(int i = 0; i < melodyMatrix.length && i < webMatrix.length; i++) {
            for(int j= 0; j < melodyMatrix[0].length && j < webMatrix[0].length; j++) {
                if(melodyMatrix[i][j]) {
                    webMatrix[i][j].setSelected(true);
                } else {
                    webMatrix[i][j].setSelected(false);
                }
            }
        }
    }

}
