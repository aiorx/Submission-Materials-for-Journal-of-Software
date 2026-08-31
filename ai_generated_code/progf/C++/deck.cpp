

#include "deck.hpp"
#include <thread>
#include <random>
#include <iostream>
#include <algorithm>

namespace ariel
{

    Deck::Deck() // Development card deck
    {
        addToDeck("knight", 19);
        addToDeck("victory point", 4);
        addToDeck("monopoly", 2);
        addToDeck("build 2 road", 2);
        addToDeck("year of plenty", 2);

        ShuffleCards();
    }

    Deck::Deck(string source) // Sources card decks
    {
        addToDeck(source, 19);
    }

    void Deck::ShuffleCards() // this function Derived using common development resources
    {

        random_device rd;
        mt19937 g(rd());
        shuffle(cardDeck.begin(), cardDeck.end(), g);
    }

    string Deck::drawCard()
    {
        if (this->isEmpty())
        {
            cout << "No more cards to draw" << endl;
            return "";
        }
        else
        {
            string card = cardDeck.back();
            cardDeck.pop_back();
            size--;
            return card;
        }
    }

    bool Deck::isEmpty() const
    {
        return size == 0;
    }

    void Deck::printDeck()
    {
        for (size_t i = 0; i < cardDeck.size(); i++)
        {
            cout << cardDeck[i] << endl;
        }
    }
    void Deck::addToDeck(string card)
    {
        addToDeck(card, 1);
    }
    void Deck::addToDeck(string card, int amount)
    {
        for (int i = 0; i < amount; i++)
        {
            cardDeck.push_back(card);
            size++;
        }
    }
}
