package BlackJackGame;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.List;

public class BlackJackGUI extends JFrame {
    private JButton hitButton;
    private JButton standButton;
    private JButton newGameButton;
    private BackgroundPanel backgroundPanel;
    private JPanel playerCardPanel;
    private JPanel dealerCardPanel;
    private JPanel buttonPanel;
    private JPanel scorePanel;
    private JLabel playerScoreLabel;
    private JLabel dealerScoreLabel;
    private BlackJackGame game;
    private JLabel dealerFaceDownCardLabel;
    private JLabel balanceLabel;
    private JTextField betAmountField;
    private JButton placeBetButton;
    private BlackJackDBManager dbManager;
    private String username;
    private Betting currentBet;
    private JButton quitButton;
    private JButton logoutButton;
    double balance;

    public BlackJackGUI(String username) {
        // Set the username
        this.username = username;

        // Initialize dbManager
        dbManager = new BlackJackDBManager();

        game = new BlackJackGame();

        setTitle("BlackJack Game");
        setSize(800, 600); // Increased size to accommodate more cards
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Create the background panel
        backgroundPanel = new BackgroundPanel("./resources/cards/table.jpg"); // Update with your background image path, this line of code Crafted with standard coding tools
        backgroundPanel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();

        // Create components
        balanceLabel = new JLabel("Balance: $" + dbManager.getUserBalance(username));

        // Add betting components
        betAmountField = new JTextField(10);
        placeBetButton = new JButton("Place Bet");
        quitButton = new JButton("Quit");
        logoutButton = new JButton("Logout");

        JPanel bettingPanel = new JPanel();
        bettingPanel.add(new JLabel("Bet Amount:"));
        bettingPanel.add(betAmountField);
        bettingPanel.add(placeBetButton);
        bettingPanel.add(quitButton);
        bettingPanel.add(logoutButton);
        
        hitButton = new JButton("Hit");
        hitButton.setEnabled(false);
        standButton = new JButton("Stand");
        standButton.setEnabled(false);
        newGameButton = new JButton("New Game");

        playerCardPanel = new JPanel();
        playerCardPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 10, 10)); // Use FlowLayout for arranging cards horizontally
        playerCardPanel.setOpaque(false); // Make playerCardPanel transparent

        dealerCardPanel = new JPanel();
        dealerCardPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 10, 10)); // Use FlowLayout for arranging cards horizontally
        dealerCardPanel.setOpaque(false); // Make dealerCardPanel transparent

        playerScoreLabel = new JLabel("Player Score: 0");
        playerScoreLabel.setForeground(Color.WHITE);

        dealerScoreLabel = new JLabel("Dealer Score: 0");
        dealerScoreLabel.setForeground(Color.WHITE);

        // Create the button panel
        buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout());
        buttonPanel.add(hitButton);
        buttonPanel.add(standButton);
        buttonPanel.add(newGameButton);
        buttonPanel.setOpaque(false); // Make buttonPanel transparent

        // Create the score panel
        scorePanel = new JPanel();
        scorePanel.setLayout(new FlowLayout());
        scorePanel.add(playerScoreLabel);
        scorePanel.add(dealerScoreLabel);
        scorePanel.setOpaque(false); // Make scorePanel transparent

        // Add dealerCardPanel to the top
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.CENTER;
        backgroundPanel.add(dealerCardPanel, gbc);

        // Add playerCardPanel to the bottom center
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        backgroundPanel.add(playerCardPanel, gbc);

        // Add buttonPanel below the playerCardPanel
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.anchor = GridBagConstraints.CENTER;
        backgroundPanel.add(buttonPanel, gbc);

        // Add scorePanel below the buttonPanel
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.anchor = GridBagConstraints.CENTER;
        backgroundPanel.add(scorePanel, gbc);

        // Add background panel to the frame
        add(backgroundPanel, BorderLayout.CENTER);
        
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(balanceLabel, BorderLayout.NORTH);
        topPanel.add(bettingPanel, BorderLayout.SOUTH);
        add(topPanel, BorderLayout.NORTH);

        // Add action listeners
        hitButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Card card = game.hit();
                if (card == null) {
                    JOptionPane.showMessageDialog(null, "You cannot draw any more cards!");
                } else {
                    displayPlayerCard(card.getIndex());
                    updateScores();
                    if (game.hasPlayerBusted()) {
                        hitButton.setEnabled(false); // Disable hit button
                        standButton.setEnabled(false); // Disable stand button
                        dealerTurn();
                    }
                }
            }
        });
        
              placeBetButton.addActionListener(new ActionListener() { //p Place bet button
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    double betAmount = Double.parseDouble(betAmountField.getText());
                    balance = dbManager.getUserBalance(username);

                    // Reset balance to $100 if it is 0
                    if (balance == 0) {
                        dbManager.updateUserBalance(username, 100);
                        balance = 100;
                        balanceLabel.setText("Balance: $" + dbManager.getUserBalance(username));
                    }

                    if (betAmount <= balance && betAmount >= 0) // If the bet amount is greater than or equal to 0, and bet amount less than or equal to balance
                    {
                        currentBet = new Betting(username, betAmount);
                        dbManager.placeBet(currentBet);
                        JOptionPane.showMessageDialog(null, "Bet placed successfully!");
                        balanceLabel.setText("Balance: $" + dbManager.getUserBalance(username));
                        placeBetButton.setEnabled(false);
                        betAmountField.setEnabled(false);
                        hitButton.setEnabled(true);
                        standButton.setEnabled(true);
                        displayInitialCards();
                        updateScores();
                    } 
                    else if(betAmount < 0) 
                    {
                        JOptionPane.showMessageDialog(null, "Cannot Bet Less Than Zero!");
                    }
                    else
                    {
                        JOptionPane.showMessageDialog(null, "Insufficient balance.");
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(null, "Invalid bet amount. Please enter a valid number.");
                } catch (SQLException ex) {
                    JOptionPane.showMessageDialog(null, "Error placing bet: " + ex.getMessage());
                }
            }
        });

        standButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                hitButton.setEnabled(false);
                standButton.setEnabled(false);
                dealerTurn(); // Trigger dealer turn
            }
        });

        newGameButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                game.newGame();
                playerCardPanel.removeAll(); // Clear the screen
                dealerCardPanel.removeAll();
                playerCardPanel.revalidate();
                playerCardPanel.repaint();
                dealerCardPanel.revalidate();
                dealerCardPanel.repaint();
                hitButton.setEnabled(false); // Disable hit button for new game
                standButton.setEnabled(false); // Disable stand button for new game
                placeBetButton.setEnabled(true); // Enable place bet button for new game
                betAmountField.setEnabled(true); // Enable bet amount box for new game
                
                balance = dbManager.getUserBalance(username);
               
                playerScoreLabel.setText("Player Score: 0");
                dealerScoreLabel.setText("Dealer Score: 0");
                       
                if (balance == 0) // Only update the text label to 100 if balance reaches 0, this is a visual change 
                {
                    balanceLabel.setText("Balance: $100.0");
                }
               
            }
        });
        
        // Quit button action listener
        quitButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.exit(0); // close the application
            }
        });
        
        logoutButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
                new WelcomeGUI().setVisible(true);
            }
        });
    }
    // Deal the cards at the very start of the game
    private void displayInitialCards() {
        List<Card> playerHand = game.getPlayerHand();
        List<Card> dealerHand = game.getDealerHand();
        for (Card card : playerHand) {
            displayPlayerCard(card.getIndex());
        }
        if (!dealerHand.isEmpty()) {
            displayDealerCard(dealerHand.get(0).getIndex());
            displayFaceDownCard();
        }
    }
// Displays Current player cards to the screen
    private void displayPlayerCard(int cardValue) {
        String imagePath = "./resources/cards/" + cardValue + ".png";
        ImageIcon cardIcon = new ImageIcon(imagePath);
        Image image = cardIcon.getImage();
        Image scaledImage = image.getScaledInstance(100, 150, java.awt.Image.SCALE_SMOOTH);
        cardIcon = new ImageIcon(scaledImage);

        JLabel cardLabel = new JLabel(cardIcon);
        playerCardPanel.add(cardLabel);
        playerCardPanel.revalidate();
        playerCardPanel.repaint();
    }
// Displays dealer cards to the screen
    private void displayDealerCard(int cardValue) {
        String imagePath = "./resources/cards/" + cardValue + ".png";
        ImageIcon cardIcon = new ImageIcon(imagePath);
        Image image = cardIcon.getImage();
        Image scaledImage = image.getScaledInstance(100, 150, java.awt.Image.SCALE_SMOOTH);
        cardIcon = new ImageIcon(scaledImage);

        JLabel cardLabel = new JLabel(cardIcon);
        dealerCardPanel.add(cardLabel);
        dealerCardPanel.revalidate();
        dealerCardPanel.repaint();
    }
// Displays facedown card to the screen
    private void displayFaceDownCard() {
        String imagePath = "./resources/cards/cardback.png";
        ImageIcon cardIcon = new ImageIcon(imagePath);
        Image image = cardIcon.getImage();
        Image scaledImage = image.getScaledInstance(100, 150, java.awt.Image.SCALE_SMOOTH);
        cardIcon = new ImageIcon(scaledImage);

        dealerFaceDownCardLabel = new JLabel(cardIcon);
        dealerCardPanel.add(dealerFaceDownCardLabel);
        dealerCardPanel.revalidate();
        dealerCardPanel.repaint();
    }
// Dealer turn
    private void dealerTurn() {
        game.revealDealerCard();
        displayDealerCards();
        while (game.getDealerScore() < 17) {
            Card card = game.dealerHit();
            displayDealerCard(card.getIndex());
            updateScores();
        }

        String resultMessage;
// Logic for handeling if player or dealer wins
        if (game.getPlayerScore() > 21) {
            resultMessage = "You went over 21!";
        } else if (game.getPlayerScore() == game.getDealerScore()) {
            resultMessage = "Tie!";
            tie(true);
        } else if (game.getDealerScore() == 21) {
            resultMessage = "Dealer Has 21!";
        } else if (game.hasDealerBusted()) {
            resultMessage = "Dealer went over 21! You win!";
            updateBalance(true); // Player wins
        } else if (game.getDealerScore() > game.getPlayerScore()) {
            resultMessage = "Dealer wins!"; // Dealer Wins
        } else if (game.getPlayerScore() == 21) {
            resultMessage = "BlackJack!";
            updateBalance(true);
        } else {
            resultMessage = "You win!";
            updateBalance(true); // Player wins
        }

        JOptionPane.showMessageDialog(null, resultMessage);
        balanceLabel.setText("Balance: $" + dbManager.getUserBalance(username)); // Update the balance label
    }

    private void displayDealerCards() {
        dealerCardPanel.removeAll();
        List<Card> dealerHand = game.getDealerHand();
        for (int i = 0; i < dealerHand.size(); i++) {
            displayDealerCard(dealerHand.get(i).getIndex());
        }
    }
// Update the user balance
    private void updateBalance(boolean playerWins) {
        double betAmount = currentBet.getBetAmount();
        double winnings = playerWins ? betAmount * 2 : betAmount;
        try {
            dbManager.updateUserBalance(username, winnings);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Error updating balance: " + e.getMessage());
        }
    }

    // Method for if there is a tie so the balance is correctly updated to go back to before bet was placed
    private void tie(boolean tieGame) {
        double betAmount = currentBet.getBetAmount();
        double winnings = tieGame ? betAmount : betAmount;
        try {
            dbManager.updateUserBalance(username, winnings);
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Error updating balance: " + e.getMessage());
        }
    }

    // Update the scores to the screen
    private void updateScores() {
        int playerScore = game.getPlayerScore();
        int dealerScore = game.getDealerScore();
        playerScoreLabel.setText("Player Score: " + playerScore);
        dealerScoreLabel.setText("Dealer Score: " + dealerScore);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new BlackJackGUI("player1").setVisible(true);
            }
        });
    }
}
