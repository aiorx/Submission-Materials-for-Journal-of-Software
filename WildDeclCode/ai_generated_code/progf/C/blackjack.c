//---------------------------------------------------------------------------------------------------------------------
// This code is a blackjack program that works with command line arguments to determine number of players,
// number of decks, seed (for randomizing the cards) and the possibility to enter a file to be printed before the game
// 
//
// Tutor: --
//
// Author: --
//---------------------------------------------------------------------------------------------------------------------
//

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <stdbool.h>

#define SUIT_COUNT 4
#define VALUE_COUNT 13
#define WELCOME_MESSAGE "welcome_message.txt"

typedef enum _Suit_
{
  CLUBS,
  DIAMONDS,
  SPADES,
  HEARTS
} Suit;

typedef enum _ErrorCodes_
{
  OUT_OF_MEMORY = 1,
  INVALID_PARAMETERS = 2,
  INVALID_ARGUMENT_TYPE = 3,
  FILE_OPEN_FAIL = 3,
  NOT_ENOUGH_CARDS = 4,
  UNKNOWN_COMMAND = 4,
  EMPTY_SHOE = 4,
  BAD = 5,
  GOOD = 6,
  QUIT = 0
} ErrorCodes;

typedef struct _Card_
{
  Suit suit_;
  int value_;
} Card;

typedef struct _Hand_
{
  Card *cards_;
  size_t count_;
  size_t capacity_;
} Hand;

typedef struct _Shoe_
{
  Card *cards_;
  size_t total_;
  size_t next_index_;
} Shoe;

//---------------------------------------------------------------------------------------------------------------------
/// Function to allocate memory and if it fails print an error.
/// @param size The number of bytes that are supposed to be allocated
/// @return A pointer to the allocated memory, or to NULL if it fails
void *memoryFunction(size_t size)
{
  void *ptr = malloc(size);
  if (!ptr)
  {
    printf("Out of memory!\n");
    return NULL; //UNTEN EINBAUEN DAS FALLS NULL
  }
  return ptr;
}

//---------------------------------------------------------------------------------------------------------------------
/// Gneratees a specified amount of 52 card decks in array
/// @param deck_num the number of decks supposd to be generated
/// @param total_cards the number of cards allocated 
/// @return a pointer to the allocated array or NULL
Card *generateDeck(size_t deck_num, int *total_cards)
{
  *total_cards = deck_num * SUIT_COUNT * VALUE_COUNT;
  Card *deck = memoryFunction(*total_cards * sizeof(Card));
  if(!deck)
  {
    return NULL;//UNTEN EINBAUEN DAS FALLS NULL
  }

  int index = 0;

  for (size_t d = 0; d < deck_num; d++)
  {
    for (int s = 0; s < SUIT_COUNT; s++)
    {
      for (int v = 2; v <= 14; v++)
      {
        deck[index].suit_ = s;
        deck[index].value_ = v;
        index++;
      }
    }
  }
  return deck;
}

//---------------------------------------------------------------------------------------------------------------------
/// Randomly shuffles an array of cards using a seed and using Fisher-Yates
/// @param deck Pointer to the first element ofthe Card array
/// @param total_cards the total number of cards in the deck
/// @param seed Seed for shuffling
/// @return void
void shuffleCards(Card *deck, int total_cards, size_t seed)
{
  srand(seed);

  for (int i = total_cards - 1; i > 0; i--)
  {
    int random_index = rand() % (i + 1);
    Card tmp = deck[i];
    deck[i] = deck[random_index];
    deck[random_index] = tmp;
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// Makes a shoe by creating and shuffling the cards of the shoe
/// @param shoe Pointer to the shoe
/// @param decks the number of cards allocated
/// @param seed seed for shuffling
/// @return GOOD if success, or OUT_OF_MEMORY if it failed
int makeShoe(Shoe *shoe, size_t decks, size_t seed)
{
  shoe->cards_ = generateDeck(decks, (int *)&shoe->total_);
  if (!shoe->cards_)
  {
    return OUT_OF_MEMORY;
  }
  shuffleCards(shoe->cards_, (int)shoe->total_, (int)seed);
  shoe->next_index_ = 0;
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Draws the next card from the shoe
/// @param shoe pointer to the Shoe to draw from
/// @param card Receives the drawn card
/// @return GOOD if success or QUIT if the shoe is empty (readme)
int takeNextCard(Shoe *shoe, Card *card)
{
  if (shoe->next_index_ >= shoe->total_)
  {
    printf("Error: Shoe is empty!\n");
    return QUIT; //MAYBE DOCH NOT_ENOUGH_CARDS
  }
  *card = shoe->cards_[shoe->next_index_++];
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Checks if there are enough cards for the system to deal another round
/// @param *shoe Pointer to the shoe where it checks
/// @param player_num number of players in the game
/// @return GOOD if enough cards, NOT_ENOUGH_CARDS if not
int ensureCardsLeft(Shoe *shoe, size_t player_num)
{
  size_t needed_size = 2 * (player_num + 1);
  if (shoe->next_index_ + needed_size > shoe->total_)
  {
    printf("Error: Not enough cards left to deal another round!\n");
    return NOT_ENOUGH_CARDS;
  }
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Calculating the score of a hand.
/// @param hand pointer to the hand
/// @return the score of the hand (if under 21, ace = 11, if over 21, ace = 1)
int scoreOfHand(const Hand *hand)
{
  int sum = 0;
  int aces = 0;

  for (size_t i = 0; i < hand->count_; i++)
  {
    int v = hand->cards_[i].value_;

    if (v >= 2 && v <= 10)
    {
      sum += v;
    }
    else if (v <= 13)
    {
      sum += 10;
    }

    else
    {
      sum += 11; //chatgpt
      aces++; //chatgpt
    }
  }

  while (sum > 21 && aces > 0) //chatgpt
  {
    sum -= 10; //chatgpt
    aces--; //chatgpt
  }
  return sum;
}

//---------------------------------------------------------------------------------------------------------------------
/// Returns the symbol for the suit.
/// @param suit the suit
/// @return question mark or the symbol
const char *suitSymbol(Suit suit)
{
  switch (suit)
  {
  case CLUBS:
    return "♣️";
  case DIAMONDS:
    return "♦️";
  case SPADES:
    return "♠️";
  case HEARTS:
    return "♥️";
  }

  return "?";
}

//---------------------------------------------------------------------------------------------------------------------
/// Return card value from 2 - A, either the letter, or the number
/// @param value The card value
/// @return value either number 2-10 or letter J,Q,K,A
const char *valueSymbol(int value) //got this Adapted from standard coding samples but understand it
{
  switch (value)
  {
  case 11:
    return "J";
  case 12:
    return "Q";
  case 13:
    return "K";
  case 14:
    return "A";

  default:
  {
    static char buf[3]; //CHATGPT
    snprintf(buf, sizeof(buf), "%d", value); //CHATGPT
    return buf;
  }
  }
}
//---------------------------------------------------------------------------------------------------------------------
/// Prints the border on top of the card
/// @param index position of the card in the hand to know if it should print another border
/// @param total total cards in the hand
void printCardBorder(size_t index, size_t total)
{
  printf("+-----+");
  if (index < total - 1)
  {
    printf("  ");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// prints the suit symbols of the card
/// @param card pointer to the card
/// @param index position in the hand
/// @param total total cards in the hand
void printCardTop(const Card *card, size_t index, size_t total)
{
  const char *sym = suitSymbol(card->suit_);
  printf("|%s   %s|", sym, sym);
  if (index < total - 1)
  {
    printf("  ");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// prints the value symbol in the card
/// @param card Pointer to the Card to print
/// @param index position in the hand
/// @param total total cards in the hand
void printCardMiddle(const Card *card, size_t index, size_t total)
{
  const char *val = valueSymbol(card->value_);

  if (strlen(val) == 2)
  {
    printf("|  %2s |", val); //chatgpt
  }
  else
  {
    printf("| %2s  |", val); //chatgpt
  }

  if (index < total - 1)
  {
    printf("  ");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// print the bottom suit symbols of card
/// @param card pointer to the Card
/// @param index position in the hand
/// @param total total cards in the hand
void printCardBottom(const Card *card, size_t index, size_t total)
{
  const char *sym = suitSymbol(card->suit_);
  printf("|%s   %s|", sym, sym);
  if (index < total - 1)
  {
    printf("  ");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// prints the "#" for a face down card
/// @param index position in the hand
/// @param total total cards in the hand
void printEmpty(size_t index, size_t total)
{
  printf("|#####|");
  if (index < total - 1)
  {
    printf("  ");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// Calls the specific card functions above to print the hands cards
/// @param hand pointer to the hand
/// @param hide_second_card if the dealers second card needs to be hidden or not
void printHand(const Hand *hand, bool hide_second_card)
{
  //toprow
  printf(" ");
  for (size_t i = 0; i < hand->count_; ++i)
  {
    printCardBorder(i, hand->count_);
  }
  printf("\n");
  printf(" ");

  //topp
  for (size_t i = 0; i < hand->count_; ++i)
  {
    if (i == 1 && hide_second_card)
    {
      printEmpty(i, hand->count_);
    }
    else
    {
      printCardTop(&hand->cards_[i], i, hand->count_);
    }
  }
  printf("\n");
  printf(" ");

  //values
  for (size_t i = 0; i < hand->count_; ++i)
  {
    if (i == 1 && hide_second_card)
    {
      printEmpty(i, hand->count_);
    }
    else
    {
      printCardMiddle(&hand->cards_[i], i, hand->count_);
    }
  }
  printf("\n");
  printf(" ");

  //bottom
  for (size_t i = 0; i < hand->count_; ++i)
  {
    if (i == 1 && hide_second_card)
    {
      printEmpty(i, hand->count_);
    }
    else
    {
      printCardBottom(&hand->cards_[i], i, hand->count_);
    }
  }
  printf("\n");
  printf(" ");

  //bottom
  for (size_t i = 0; i < hand->count_; ++i)
  {
    printCardBorder(i, hand->count_);
  }
  printf("\n");
  printf(" ");
}

//---------------------------------------------------------------------------------------------------------------------
/// print the dealer’s output(card(s))
/// @param dealer pointer to the dealer’s Hand.
/// @param reveal if the dealers full hand and score should be shown
void printDealer(const Hand *dealer, bool reveal)
{
  printf("      DEALER\n");
  printHand(dealer, !reveal);
  if (reveal)
  {
    printf("score: %d\n\n", scoreOfHand(dealer));
  }
  else
  {
    printf("score: ?\n\n");
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// print the cards of one player and result, if its final
/// @param index player index from 0
/// @param player pointer to the players hand
/// @param dealer_score the dealers score, or –1 if not determined
/// @param is_final if round is finished or not
/// @param current_player index of the player whos turn it is
void printPlayer(size_t index, const Hand *player, int dealer_score, bool is_final, size_t current_player)
{
  int p = scoreOfHand(player);
  printf("     PLAYER %zu\n", index + 1);
  printHand(player, false);
  
  printf("score: %d\n", p);

  if (!is_final)
  {
    printf("\n");
  }
  
  if (is_final)
  {
    if (dealer_score >= 0)
    {
      if (p > 21)
      {
        printf(" Dealer has won!\n");
      }
      else if (dealer_score > 21 || p > dealer_score)
      {
        printf(" Player has won!\n");
      }
      else if (p < dealer_score)
      {
        printf(" Dealer has won!\n");
      }
      else
      {
        printf(" Hand was drawn!\n");
      }
      printf("\n");
    }
  }

  else if(index == current_player) //chatgpt
  {
    if(p > 21)
    {
      printf(" Dealer has won!\n\n");
    }
  }
  else{

  }
}

//---------------------------------------------------------------------------------------------------------------------
/// print the entire table: dealer and all players for the round
/// @param round the round number
/// @param dealer pointer to dealers hand
/// @param players the hands of the players
/// @param player_num the number of players
/// @param is_final if round is over or not
/// @param current_player current player number (turn)
void printTable(int round, const Hand *dealer, Hand players[], size_t player_num, bool is_final, size_t current_player)
{
  printf("\n---- ROUND %d ----\n\n", round);
  printDealer(dealer, is_final);
  int dealer_score = -1;
  if (is_final)
  {
    dealer_score = scoreOfHand(dealer);
  }
  for (size_t i = 0; i < player_num; ++i)
  {
    printPlayer(i, &players[i], dealer_score, is_final, current_player);
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// Creates an empty hand with a capacity
/// @param hand pointer to the Hand to create
/// @return GOOD if success, OUT_OF_MEMORY if fails.
int makeHand(Hand *hand)
{
  hand->capacity_ = 4;
  hand->count_ = 0;
  if(!(hand->cards_ = memoryFunction(hand->capacity_ * sizeof(Card))))
  {
    return OUT_OF_MEMORY;
  }
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Add a card to a Hand, if capacity full, add capacity
/// @param hand pointer to the hand
/// @param card the card to add
/// @return GOOD if success, OUT_OF_MEMORY if fails
int addCard(Hand *hand, Card card)
{
  if (hand->count_ == hand->capacity_)
  {
    hand->capacity_ *= 2;
    if (!(hand->cards_ = realloc(hand->cards_, hand->capacity_ * sizeof(Card))))
    {
      printf("Out of memory!\n");
      return OUT_OF_MEMORY;
    }
  }
  hand->cards_[hand->count_] = card;
  hand->count_++;
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// free the hand memory
/// @param hand pointer to the hand to be freed
void freeHand(Hand *hand)
{
  free(hand->cards_);
  hand->cards_ = NULL;
  hand->count_ = 0;
  hand->capacity_ = 0;
}

//---------------------------------------------------------------------------------------------------------------------
/// checking whether all inputs are digits
/// @param argc argument count from main/command line arguments
/// @param argv array of the arguments
/// @return GOOD if all are digits, BAD if not
int checkInputs(int argc, const char *argv[])
{
  for (int i = 1; i < argc && i <= 3; i++)
  {
    for (int j = 0; argv[i][j]; j++)
    {
      if (!isdigit((unsigned char)argv[i][j])) //chatgpt
      {
        printf("Invalid type for argument!\n");
        return BAD;
      }
    }
  }
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// print the welcome-message file (or file specified in command line arguments)
/// @param filename name of the file
/// @return 0 if success, FILE_OPEN_FAIL if the file cant be opened or doesnt exist
int printWelcomeMessage(const char *filename)
{
  FILE *file = fopen(filename, "r");
  int ch;
  if (!file)
  {
    printf("Error: Failed to open file!\n");
    return FILE_OPEN_FAIL;
  }
  while ((ch = fgetc(file)) != EOF)
  {
    printf("%c", ch);
  }
  fclose(file);
  return 0;
}

//---------------------------------------------------------------------------------------------------------------------
/// Using the command-line arguments to set them to players, decks, seed, and file
/// @param argc argument count from main
/// @param argv array of the arguments
/// @param player_num number of players (default 1).
/// @param decks number of decks (default 1).
/// @param seed seed (default 0).
/// @param filename welcome-message filename (default WELCOME_MESSAGE).
/// @return GOOD if success, or the respective error message for wrong type, parameter or memory
int parseArguments(int argc, char *argv[], size_t *player_num, size_t *decks, size_t *seed, const char **filename)
{
  *player_num = 1;
  *decks = 1;
  *seed = 0;
  *filename = WELCOME_MESSAGE;

  if (argc > 5)
  {
    printf("Invalid number of parameters given!\n");
    return INVALID_PARAMETERS;
  }
  if (checkInputs(argc, (const char **)argv) == BAD)
  {
    return INVALID_ARGUMENT_TYPE;
  }
  if (argc >= 2)
    *player_num = atoi(argv[1]);

  if (argc >= 3)
    *decks = atoi(argv[2]);

  if (argc >= 4)
    *seed = atoi(argv[3]);

  if (argc == 5)
    *filename = argv[4];

  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Reset all hands to empty for a new round
/// @param dealer pointer to the dealers hand
/// @param players the player Hands
/// @param player_num number of players
/// @return GOOD if success, OUT_OF_MEMORY if failure
int resetHands(Hand *dealer, Hand *players, size_t player_num)
{
  freeHand(dealer);
  if(makeHand(dealer) != GOOD)
  {
    return OUT_OF_MEMORY;
  }
  for(size_t i = 0; i < player_num; i++)
  {
    freeHand(&players[i]);
    if(makeHand(&players[i]) != GOOD)
    {
    return OUT_OF_MEMORY;
    }
  }
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// Check that the total cards are enough for the first deal
/// @param decks number of decks
/// @param player_num number of players
/// @return GOOD if there are enough cards, NOT_ENOUGH_CARDS if not.
int enoughCards(size_t decks, size_t player_num)
{
  size_t cards_available = decks * SUIT_COUNT * VALUE_COUNT;
  size_t cards_needed = (player_num + 1) * 2;
  if (cards_needed > cards_available)
  {
    printf("Not enough cards left to deal another round!\n");
    return NOT_ENOUGH_CARDS;
  }
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// initializes everything: shoe, dealer hand, and player hands
/// @param players array of player hands
/// @param dealer pointer to dealers hand
/// @param shoe pointer to shoe
/// @param decks number of decks
/// @param seed seed
/// @param player_num number of players
/// @return GOOD if success, OUT_OF_MEMORY if failure.
int initialize(Hand *players, Hand *dealer, Shoe *shoe, size_t decks, size_t seed, size_t player_num)
{
  if (makeShoe(shoe, decks, seed) != GOOD)
  {
    return OUT_OF_MEMORY;
  }
  
  if(makeHand(dealer) != GOOD)
    {
    return OUT_OF_MEMORY;
    }
  for (size_t i = 0; i < player_num; i++)
  {
    if(makeHand(&players[i]) != GOOD)
    {
    return OUT_OF_MEMORY;
    }
  }

  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// handles the start of the game: handles arguments, prints welcome message, check cards for initial deal
/// @param argc argument count from main
/// @param argv array of the arguments
/// @param player_num number of players
/// @param decks number of decks
/// @param seed seed
/// @param filename welcome-message filename
/// @return GOOD if success or respecitve error codes if it fails
int startGame(int argc, char *argv[], size_t *player_num, size_t *decks, size_t *seed, const char **filename)
{
  int arguments = parseArguments(argc, argv, player_num, decks, seed, filename);
  if (arguments != GOOD)
  {
    return arguments;
  }

  printWelcomeMessage(*filename);

  if (enoughCards(*decks, *player_num) == NOT_ENOUGH_CARDS)
  {
    return NOT_ENOUGH_CARDS;
  }
  return GOOD;
} 

//---------------------------------------------------------------------------------------------------------------------
/// Checks for any blackjack by a player on the initial deal
/// @param round current round
/// @param dealer pointer to dealers hand
/// @param players array of player hands
/// @param player_num number of players
/// @return true if a player has Blackjack, false if not
bool checkPlayerBlackjack(int round, Hand *dealer, Hand players[], size_t player_num)
{
  bool blackjack = false;
  for (size_t p = 0; p < player_num; p++)
  {
    if (scoreOfHand(&players[p]) == 21)
    {
      blackjack = true;
      break;
    }
  }

  if(blackjack)
  {
    printTable(round, dealer, players, player_num, true, -1);
    return true;
  }
  else
  {
    printTable(round, dealer, players, player_num, false, -1);
    return false;
  }
}

//---------------------------------------------------------------------------------------------------------------------
/// Free all the allocated memory
/// @param shoe pointer to the shoe
/// @param dealer pointer to dealers hand
/// @param players array of player hands
/// @param player_num nmber of players
void freeThings(Shoe *shoe, Hand *dealer, Hand *players, size_t player_num)
{
  free(shoe->cards_);
  freeHand(dealer);
  for(size_t i = 0; i < player_num; i++)
  {
    freeHand(&players[i]);
  }
  free(players);
}

//---------------------------------------------------------------------------------------------------------------------
/// Reads input dynamically as specified in readme and can resize if input too big
/// @return pointer to the string with "\0" at the end or NULL if failed
char* getInput(void) //hilfe von chatgpt
{
  char *buf = NULL; //chatgpt
  size_t sizebuf = 0;
  size_t length = 0;
  int c = 0;

  while ((c = getchar()) != '\n' && c != EOF)
  {
    if(length + 1 >= sizebuf)
    {
      size_t new_size;
      if (sizebuf == 0)
      {
        new_size = 8;
      }
      else
      {
        new_size = sizebuf * 2;
      }

      char *tmp = realloc(buf, new_size); //chatgpt idee ohne malloc nur mit realloc memory zu machen
      if (!tmp)
      {
        free(buf);
        return NULL;
      }
      buf = tmp;
      sizebuf = new_size;
    }
    buf[length++] = (char)c;
  }
  if(buf)
  {
    buf[length] = '\0';
  }
  
  return buf;
}

//---------------------------------------------------------------------------------------------------------------------
/// Makes each players turn, has hit, stand, quit logic
/// @param round  round number.
/// @param shoe pointer to the Shoe for drawing cards.
/// @param dealer pointer to dealer’s Hand (for final printing).
/// @param players array of player Hands.
/// @param player_num number of players.
/// @param round_over if the round ends "early"
/// @return GOOD if game continues, QUIT if player quitted, or the respective error code.
int playerTurnSystem(int round, Shoe *shoe, Hand *dealer, Hand players[], size_t player_num, bool *round_over) //habe hilfe von ChatGPT bekommen
{
  *round_over = false;
  for (size_t p = 0; p < player_num; p++)
  {
    bool player_done = false;
    while (!player_done)
    {
      int player_score = scoreOfHand(&players[p]);
      printf("PLAYER %zu: What do you want to do?\n > ", p + 1);
      char *buf = getInput();
      if (!buf)
      {
        *round_over = true;
        freeThings(shoe, dealer, players, player_num);
        return OUT_OF_MEMORY;
      }

      if (strcmp(buf, "hit") == 0)
      {
        Card c = {0};
        if (takeNextCard(shoe, &c) != GOOD) return EMPTY_SHOE;
        if (addCard(&players[p], c) != GOOD)
        {
          freeThings(shoe, dealer, players, player_num);
          return OUT_OF_MEMORY;
        }
        player_score = scoreOfHand(&players[p]);
        if (player_score > 21)
        {
          printTable(round, dealer, players, player_num, true, p);
          free(buf);
          *round_over = true;
          player_done = true;
          break;
        }
        printTable(round, dealer, players, player_num, false, p);
        free(buf);
      }
      else if (strcmp(buf, "stand") == 0)
      {
        player_done = true;
        if (p + 1 < player_num)
        {
          printTable(round, dealer, players, player_num, false, p);
        }
        free(buf);
      }
      else if (strcmp(buf, "quit") == 0)
      {
        free(buf);
        return QUIT;
      }
      else
      {
        free(buf);
        *round_over = true;
        printf("Error: Unknown command!\n");
      }
    }
  }
  return GOOD;
}


//---------------------------------------------------------------------------------------------------------------------
/// Deals two cards to each player and the dealer
/// @param shoe pointer to the shoe
/// @param dealer pointer to the dealers hand
/// @param players array of player hands
/// @param player_num number of players
/// @return GOOD if success, EMPTY_SHOE or OUT_OF_MEMORY if failure
int dealStartHands(Shoe *shoe, Hand *dealer, Hand players[], size_t player_num)
{
  for (int pass = 0; pass < 2; pass++)
  {
    for (size_t p = 0; p < player_num; p++)
    {
      Card c = {0};
      if (takeNextCard(shoe, &c) != GOOD)
      {
        return EMPTY_SHOE; //maybe return quit
      }
      if (addCard(&players[p], c) != GOOD)
      {
        return OUT_OF_MEMORY;
      }
    }

    Card d = {0};
    if (takeNextCard(shoe, &d) != GOOD)
    {
      return EMPTY_SHOE;
    }
    if (addCard(dealer, d) != GOOD)
    {
      return OUT_OF_MEMORY;
    }
  }
  return GOOD;
}


//---------------------------------------------------------------------------------------------------------------------
/// If dealer has score under 17 a card is added, but if that fails the reppective results are returned
/// @param shoe pointer to the shoe
/// @param dealer pointer to the dealer hand
/// @return GOOD if everything worked, or an error code if something failed.
int dealerAddCard(Shoe *shoe, Hand *dealer)
{
  while (scoreOfHand(dealer) < 17)
  {
    Card c = {0};
    int result = takeNextCard(shoe, &c);
    if (result != GOOD)
    {
      return result;
    }
    int result2 = addCard(dealer, c);
    if(result != GOOD);
    {
      result2;
    }
  }
  return GOOD;
}


//---------------------------------------------------------------------------------------------------------------------
/// The game logic function, calls all other functions creates, hands and shoe, starts the game, 
/// has the turns and ensures enough cards and returns specific error codes
/// @param argc number of arguments from main
/// @param argv array of these arguments
/// @return GOOD on clean exit (shouldn't be reached), or an error code.
int blackjackProgram(int argc, char *argv[])
{
  size_t player_num = 1, decks = 1, seed = 0;
  const char *filename = WELCOME_MESSAGE;
  
  int numberStart = startGame(argc, argv, &player_num, &decks, &seed, &filename);
  if (numberStart != GOOD)
  {
    return numberStart;
  }
  
  Shoe shoe = {0};
  Hand dealer = {0};
  Hand *players = (Hand*)memoryFunction(sizeof(Hand) * player_num); //chatgpt
  if(!players)
  {
    return OUT_OF_MEMORY;
  }

  if (initialize(players, &dealer, &shoe, decks, seed, player_num) != GOOD)
  {
    free(players);
    return OUT_OF_MEMORY;
  }

  int round = 1;
  while (1)
  {
    bool round_over = false;
    resetHands(&dealer, players, player_num);
    if (ensureCardsLeft(&shoe, player_num) != GOOD)
    {
      freeThings(&shoe, &dealer, players, player_num);
      return NOT_ENOUGH_CARDS;
    }

    int deal_result = dealStartHands(&shoe, &dealer, players, player_num);
    if (deal_result != GOOD)
    {
      freeThings(&shoe, &dealer, players, player_num);
      return deal_result;
    }

    if (scoreOfHand(&dealer) == 21)
    {
      printTable(round, &dealer, players, player_num, true, -1);
      round++;
      continue;
    }

    if (checkPlayerBlackjack(round, &dealer, players, player_num))
    {
      round++;
      continue;
    }

    int answer = playerTurnSystem(round, &shoe, &dealer, players, player_num, &round_over);
    if (answer != GOOD)
    {
      freeThings(&shoe, &dealer, players, player_num);
      return answer;
    }
    
    if (round_over)
    {
      round++;
      continue;
    }
    
    int d_result = dealerAddCard(&shoe, &dealer);
    if (d_result != GOOD)
    {
      freeThings(&shoe, &dealer, players, player_num);
      return d_result;
    }

    printTable(round, &dealer, players, player_num, true, -1);
    round++;
    continue;
  }
  freeThings(&shoe, &dealer, players, player_num);
  return GOOD;
}

//---------------------------------------------------------------------------------------------------------------------
/// The main function calls the blackjackProgram which starts everything.
/// @param argc number of arguments
/// @param argv array of these arguments
/// @return whatever blackjackProgram returns
int main(int argc, char *argv[])
{
  return blackjackProgram(argc, argv);
}
