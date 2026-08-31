//Importing what I will need 
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
/**
 * A simple GUI-based card guessing game using Swing.
 * <p>
 * The user gets a card that is 1 through 13 and have to  guess
 * whether the next card will be higher or lower. The game
 * keeps score based on correct guesses. Once an incorrect
 * guess is made, the game ends.
 * </p>
 * 
 * @author Jack Fryer 
 */

public class CardGuessingGame extends JFrame {
    // Making the text and buttons that will appear in the swing interface thing 
    JLabel label1;
    JLabel label2;
    JLabel label3;
    JButton b1;
    JButton b2;

    // Here I am making the actual place where I will store what cards I will use so that the user can guess them 

    ArrayList<Integer> cards = new ArrayList<Integer>();
    int a = 0;
    int b = 0;
    int c = 0;

    //This is where I actually manipulate the swing thing to set the title and layout
    // This is the part that I got help Adapted from standard coding samples and other outside tutorials on how to use Swing 
    public CardGuessingGame() {
        this.setTitle("Card Game");
        this.setSize(400, 400);
        this.setLayout(null);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // This is where I am adding the first swing label so the user has to guess witch card
        label1 = new JLabel("Card: ?");
        label1.setBounds(150, 20, 200, 30);
        this.add(label1);

        // This is the label to promt the user 
        label2 = new JLabel("Guess higher or lower.");
        label2.setBounds(100, 50, 300, 30);
        this.add(label2);

        // This is the label that keeps score 
        label3 = new JLabel("Score: 0");
        label3.setBounds(150, 80, 200, 30);
        this.add(label3);

        //This is the higher button that when pressed will allow the logic to work through the process
        b1 = new JButton("Higher");
        b1.setBounds(80, 120, 100, 30);
        this.add(b1);

        // Same thing for higher but for lower it will allow the user to guess a lower number witch will then go to logic 
        b2 = new JButton("Lower");
        b2.setBounds(200, 120, 100, 30);
        this.add(b2);
        
        // this is where I make the cards I decided not to include the colors only the numnerical values of cards 
        for (int i = 0; i < 13; i++) {
            cards.add(i + 1);
        }

        // I asked ChatGPT about this, and it showed me the .shuffle method witch I thought was too cool not include 
        // Adapted from standard coding samples
        Collections.shuffle(cards);

        //This is where I display the chosen card
        a = cards.get(0);
        cards.remove(0);
        label1.setText("Card: " + a);

        // I had to have some help from https://docs.oracle.com/javase/tutorial/uiswing/events/actionlistener.html and other sites on the oracle help thing along with 
        // Chat gpt to try and figure out what an actionListener was and how to use it
        b1.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (cards.size() == 0) {
                    for (int i = 1; i <= 13; i++) {
                        cards.add(i);
                    }
                    Collections.shuffle(cards);
                }
                // Here is where I get the random card value 
                b = cards.get(0);
                cards.remove(0);
                // This is the actual logic for the end of the game to determine if they where higher or lower using the action event 
                if (b > a) {
                    c = c + 1;
                    label2.setText("Correct! Card was: " + b);
                    label3.setText("Score: " + c);
                    a = b;
                    label1.setText("Card: " + a);
                    //Same thing logic for if the guessed number was higher or lower 
                } else {
                    label2.setText("Wrong! Card was: " + b);
                    b1.setEnabled(false);
                    b2.setEnabled(false);
                    label1.setText("Card: " + a);
                }
            }
        });
// I used the same troutrials to make this one, as well, and this contains the other logic for if the guess the other thing 
        b2.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (cards.size() == 0) {
                    for (int i = 1; i <= 13; i++) {
                        cards.add(i);
                    }
                    Collections.shuffle(cards);
                }
                // Getting a random card 
                b = cards.get(0);
                cards.remove(0);

                //Same logic but inverse for the lower 
                if (b < a) {
                    c = c + 1;
                    label2.setText("Correct! Card was: " + b);
                    label3.setText("Score: " + c);
                    a = b;
                    label1.setText("Card: " + a);
                //Else they are wrong 
                } else {
                    label2.setText("Wrong! Card was: " + b);
                    b1.setEnabled(false);
                    b2.setEnabled(false);
                    label1.setText("Card: " + a);
                }
            }
        });
    }
//Creating the stuff to run the game 
    public static void main(String[] args) {
        CardGuessingGame g = new CardGuessingGame();
        g.setVisible(true);
    }
}
