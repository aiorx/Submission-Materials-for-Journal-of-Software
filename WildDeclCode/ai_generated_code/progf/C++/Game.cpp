#include "Game.h"
#include "AIPlayer.h"
#include "Card.h"
#include "Deck.h"
#include "GameMode.h"
#include "HumanPlayer.h"
#include "SpecialActionCard.h"

// initializes the Game object by creating a Deck object and 4 Player objects
Game::Game(GameMode *mode)
{
    this->deck = new Deck(this);
    this->gameOver = false;
    this->gameError = false;
    this->winner = nullptr;
    this->currentPlayerIndex = 0;
    this->gameMode = mode;
    this->clockwise = true;
    this->firstTurn = true;

    int playerNum = this->gameMode->getNumOfPlayers();
    int botNum = 4 - playerNum;         // sets the no. of bots according to the no. human players
                                        // max player is 4
    for (int i = 0; i < playerNum; i++) // initializes the human players with name
    {
        string playerName;
        while (true)
        {
            cout << "Enter the name of Player " << i + 1 << ": ";
            getline(cin >> ws,
                    playerName); // read full line with leading whitespace trimmed

            // Reject if name contains escape sequences or is empty
            if (playerName.empty())
            {
                cout << "Name cannot be empty. Try again.\n";
                continue;
            }

            // Regex to allow only letters, numbers, and underscores
            if (!regex_match(playerName, regex("^[a-zA-Z0-9_]+$"))) // Took help Derived using common development resources for this line
            {
                cout << "Name must contain only letters, numbers, or underscores. Try again.\n";
                continue;
            }

            break; // if valid name
        }

        players.push_back(new HumanPlayer(playerName));
        ((HumanPlayer *)players[i])
            ->setGame(this); // Let the human player access game data
    }
    for (int i = 0; i < botNum; i++) // initializes the bots
    {
        ostringstream botName;
        botName << "Bot-" << i + 1;
        players.push_back(new AIPlayer(botName.str()));
    }
    for (size_t i = 0; i < players.size(); i++) // stores the index in player object for later
    {
        players[i]->setIndex(i);
    }

    for (int i = 0; i < 7; i++) // deals initial cards to the players
    {
        for (Player *player : players)
        {
            player->addCardToHand(deck->drawCard());
        }
    }

    this->deck->addToDiscardPile(this->deck->drawCard());
    this->currentCard = this->deck->get_TopDiscard(); // sets the first card

    for (Player *p : players) // sets initial scores
    {
        playerScores[p->getName()] = 0;
    }

    loadScores();
}

void Game::start()
{
    this->currentCard->play(this); // plays the first card

    if (!this->isClockwise()) // if UNO reverse, start with index 3
        this->currentPlayerIndex = 3;

    while (true)
    {
        play();
        if (this->gameError)
        {
            cout << "===========GAME HAS BEEN TERMINATED===========\n";
            cout << "Reason: Draw deck is empty.\n";
            return;
        }

        if (checkForWinner())
        {
            break;
        }
        skipPlayer(); // changes currentPlayerIndex to the next player's index
        specialActionCheck();
    }
    // Game Over screen
    cout << "\n==================================================\n";

    cout << "                   GAME OVER\n";

    cout << "==================================================\n";

    cout << "                    WINNER\n";

    cout << "--------------------------------------------------\n";

    cout << "                  " << this->winner->getName() << "\n";

    cout << "==================================================\n";
    for (Player *player : this->players) // adds all the remaining cards from the players' hands to the discard pile
    {
        for (Card *card : player->getHand())
        {
            player->removeCardFromHand(card);
            this->deck->addToDiscardPile(card);
        }
    }
}

void Game::play()
{
    if (this->gameError)
    {
        return;
    }

    if (!this->gameMode->getIsFast())
    {
        this_thread::sleep_for(chrono::milliseconds(1500)); // adds a delay
    }

    // displays current state of the game
    cout << "\n=======================================================\n";
    cout << "               CURRENT GAME STATE\n";
    cout << "=======================================================\n";
    if (this->currentCard->get_CardType() == Special_Action)
    {
        cout << "Top Card:             " << this->currentCard->get_ColorString()
             << "Special " << this->currentCard->get_ActionTypeString() << "\n";
    }
    else
    {
        cout << "Top Card:             " << this->currentCard->get_ColorString()
             << this->currentCard->get_ActionTypeString() << "\n";
    }
    cout << "Current Color:        " << colorToString(this->currentColor) << endl;
    cout << "Current player index: " << this->currentPlayerIndex << endl;
    cout << "Current Player:       " << players[this->currentPlayerIndex]->getName()
         << "\n";
    cout << "No. of Cards :        " << this->getCurrentPlayer()->getHandSize()
         << endl;
    cout << "Direction:            " << (this->clockwise ? "Clockwise" : "Anti-Clockwise")
         << endl;
    cout << "=======================================================\n";

    if (!this->gameMode->getIsFast())
    {
        this_thread::sleep_for(chrono::milliseconds(1500));
    }

    Card *playedCard = this->getCurrentPlayer()->playTurn(
        this->currentCard, this->currentColor, this->deck);

    if (playedCard != nullptr)
    {
        if (playedCard->get_ActionType() == Skip &&
            playedCard->get_Color() == None)
        {
            this->gameError = true;
            delete playedCard; // deletes the unique card which indicates error
            return;
        }
        this->currentCard = playedCard;
        if (this->currentCard->get_Color() != None)
        {
            this->currentColor = this->currentCard->get_Color(); // changes the current color to the color of the card
        }
        this->currentCard->play(this);
    }
}

bool Game::isValidMove(Card *card)
{
    return card->canPlayOn(this->currentCard) ||
           card->get_Color() == this->currentColor; // if can play the card on the top card or current color is card color, return true
}
bool Game::isClockwise() { return this->clockwise; }

bool Game::checkForWinner()
{
    if (this->gameOver)
    {
        return true;
    }
    if (this->gameError)
    {
        return false;
    }

    if (currentPlayerIndex < 0 ||
        currentPlayerIndex >= static_cast<int>(players.size())) // error if currentPlayerIndex is not between 0 and 3
    {
        cerr << "[ERROR] Invalid currentPlayerIndex: " << currentPlayerIndex
             << endl;
        return false;
    }
    for (Player *player : this->players)
    {
        if (!player)
        {
            cerr << "[ERROR] Current player is nullptr." << endl;
            return false;
        }
        int handSize = player->getHandSize();

        if (handSize == 0)
        {
            if (player->getUno())
            {
                cout << "UNO & 0 cards\n";
                this->winner = player;
                string winnerName = player->getName();
                updateScores(winnerName);
                saveScores();
                printScores();
                this->gameOver = true;
                return true;
            }
            else
            {
                cout << "No UNO & 0 cards\n";
                for (int i = 0; i < 2; i++)
                {
                    Card *drawnCard = this->deck->drawCard();
                    if (drawnCard)
                    {
                        player->addCardToHand(drawnCard);
                    }
                    else
                    {
                        this->gameError = true;
                    }
                }
            }
        }

        // Reset UNO flag if hand size > 1 (player didn't play second-last card)
        if (handSize > 1 && player->getUno())
        {
            cout << "You called UNO but you have more than 1 card. Drawing 2 Cards\n";
            for (int i = 0; i < 2; i++)
            {
                Card *drawnCard = this->deck->drawCard();
                if (drawnCard)
                {
                    player->addCardToHand(drawnCard);
                }
                else
                {
                    this->gameError = true;
                }
            }
            player->callUno(false);
        }
    }

    return false;
}
void Game::reverseDirection() { this->clockwise = !this->clockwise; }
void Game::skipPlayer()
{
    int numPlayers = 4;
    int direction = this->isClockwise() ? 1 : -1;

    this->currentPlayerIndex =
        (this->currentPlayerIndex + direction + numPlayers) % numPlayers;
}
void Game::forceDraw(int numCards)
{
    for (int i = 0; i < numCards; i++)
    {
        Card *drawnCard = this->deck->drawCard();
        if (!drawnCard)
        {
            this->gameError = true;
            return;
        }
        this->getNextPlayer()->addCardToHand(drawnCard);
    }
}
void Game::specialDraw(int numCards, int playerIndex)
{
    for (int i = 0; i < numCards; i++)
    {
        Card *drawnCard = this->deck->drawCard();
        if (!drawnCard)
        {
            this->gameError = true;
            return;
        }

        this->getPlayer(playerIndex)->addCardToHand(drawnCard);
    }
}

void Game::changeColor(Color newColor) { this->currentColor = newColor; }

Player *Game::getPreviousPlayer()
{
    int numPlayers = 4;
    int direction = this->isClockwise() ? -1 : 1;

    int prevIndex = (currentPlayerIndex + direction + numPlayers) % numPlayers;
    return players[prevIndex];
}

Player *Game::getCurrentPlayer()
{
    return this->players[this->currentPlayerIndex];
}

Player *Game::getNextPlayer()
{
    int numPlayers = 4;
    int direction = this->isClockwise() ? 1 : -1;

    int nextIndex = (currentPlayerIndex + direction + numPlayers) % numPlayers;
    return players[nextIndex];
}

Player *Game::getPlayer(int i) { return this->players[i]; }

void Game::updateCurrentCard(Card *card) { this->currentCard = card; }

bool Game::isGameOver() { return this->gameOver; }

int Game::getCurrentPlayerIndex() { return this->currentPlayerIndex; }

string Game::colorToString(Color color)
{
    switch (color)
    {
    case Red:
        return "Red ";
    case Green:
        return "Green ";
    case Blue:
        return "Blue ";
    case Yellow:
        return "Yellow ";
    case None:
        return "None";
    default:
        return "Unknown ";
    }
}

void Game::setSpecialCards(SpecialActionCard *specialActionCard)
{
    specialCards.push_back(specialActionCard);
}

vector<SpecialActionCard *> *Game::getSpecialCards()
{
    return &this->specialCards;
}

void Game::specialActionCheck()
{
    if (this->gameError)
    {
        return;
    }

    bool skip = false, reverse = false, cardIsCurrent = false;
    Player *currentPlayer = this->getCurrentPlayer();

    if (!currentPlayer)
    {
        cerr << "[ERROR] currentPlayer is nullptr in specialActionCheck."
             << endl;
        return;
    }

    for (SpecialActionCard *card : this->specialCards)
    {
        if (!card)
        {
            cerr << "[WARNING] Found nullptr in specialCards vector.\n";
            continue;
        }
        if (card->get_TargetPlayerIndex() == this->getPreviousPlayer()->getIndex() && this->willSkip)
        {
            if (card->get_ActionType() == Reverse)
            {
                this->reverseDirection();
            }
            card->specialAction(this, this->willSkip);
        }

        if (card->get_TargetPlayerIndex() == currentPlayer->getIndex())
        {
            if (card->get_ActionType() == Skip ||
                card->get_ActionType() == Draw_Two)
            {
                skip = true;
                cout << "Special Skip " << skip << endl;
            }
            else if (card->get_ActionType() == Reverse)
            {
                reverse = !reverse;
                cout << "Special reverse " << reverse << endl;
            }

            if (card == this->currentCard)
            {
                cardIsCurrent = true;
                // cout << "Special Card " << cardIsCurrent << endl;
            }

            card->specialAction(this, this->willSkip);
        }
    }

    if (reverse)
    {
        this->skipPlayer();
    }
    else if (skip && (!this->willSkip ||
                      cardIsCurrent))
    {
        this->skipPlayer();
    }
    this->willSkip = false;
}

vector<Player *> Game::getPlayers() const { return players; }

void Game::setWillSkip(bool willSkip)
{
    this->willSkip = willSkip;
}

string Game::getWinnerName() const
{
    return winner ? winner->getName() : "None";
}

bool Game::isFirstTurn()
{
    bool temp = this->firstTurn;
    this->firstTurn = false;
    return temp;
}

void Game::setCurrentPlayerIndex(int index)
{
    this->currentPlayerIndex = index;
}

bool Game::isGameError() { return this->gameError; }

void Game::loadScores()
{
    ifstream infile("scores.txt");

    if (!infile.is_open())
    {
        cerr << "scores could not be found or opened; empty scoresheet."
             << endl;
        return;
    }

    string name;
    int score;

    while (infile >> name >> score)
    {
        playerScores[name] += score; // Accumulate scores if needed
    }

    infile.close();
}

void Game::saveScores()
{
    ofstream outfile("scores.txt", ios::app); // Append mode

    if (!outfile.is_open())
    {
        cerr << "scores could not be opened or created; scores not saved."
             << endl;
        return;
    }

    for (auto &entry : playerScores)
    {
        outfile << entry.first << " " << entry.second << endl;
    }

    outfile.close();
}

void Game::printScores()
{
    ifstream infile("scores.txt");
    if (!infile)
    {
        cerr << "Could not open scores.txt\n";
        return;
    }

    vector<pair<string, int>> scoreList;
    string name;
    int score;
    size_t numOfEntries;

    // Read name and score pairs from file
    while (infile >> name >> score)
    {
        scoreList.push_back(make_pair(name, score));
    }
    infile.close();

    // Sort in descending order of scores
    sort(scoreList.begin(), scoreList.end(),
         [](const pair<string, int> &a, const pair<string, int> &b)
         {
             return a.second > b.second;
         });

    if (scoreList.size() > 10)
    {
        numOfEntries = 10;
    }
    else
    {
        numOfEntries = scoreList.size();
    }

    // Print the sorted scores
    cout << "High Scores:\n";
    if (numOfEntries == 0)
    {
        cout << "\n NO SCORES RECORDED YET \n";
    }
    for (size_t i = 0; i < numOfEntries; ++i)
    {
        cout << i + 1 << ". " << scoreList[i].first << ": " << scoreList[i].second << "\n";
    }
}

void Game::updateScores(string winnerName)
{
    int points = 0;

    for (Player *player : players)
    {
        if (player->getName() != winnerName)
        {
            points += player->calculateScore();
        }
    }

    playerScores.clear(); // Keep only this round's winner
    playerScores[winnerName] = points;

    cout << winnerName << " gains " << points << " points this round!"
         << endl;
}

Game::~Game()
{
    delete this->deck; // Delete the deck object
    for (Player *player : players)
    {
        delete player;
    }
    players.clear();
}