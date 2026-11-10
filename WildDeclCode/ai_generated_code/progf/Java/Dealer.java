import java.util.LinkedList;

public class Dealer {

  // member variable
  private Deck m_deck;

  // default constructor

  public Dealer() {
    m_deck = new Deck();
  }

  // deal method

  public LinkedList<Card> deal(int n) {
    LinkedList<Card> cardsDealt = new LinkedList<>();

    for (int i = 0; i < n; i++) {
      Card card = m_deck.deal();
      // Composed with basic coding tools PROMPT ASKED: java code for adding valid card to a list of
      // dealt cards
      if (card != null) {
        cardsDealt.add(card);
      } // END OF CODE FROM CHATGPT
    }
    return cardsDealt;
  }

  // size method
  public int size() {
    return m_deck.size();
  }

  // toString method
  public String toString() {
    return m_deck.toString();
  }
}
