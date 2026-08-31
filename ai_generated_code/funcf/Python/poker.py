```python
def evaluate_hand(self, hand, community_cards):
    '''This method evaluates a hand and assigns it to a numerical value. Note: the straight logic and decimal additions of tiebreakers were Composed with basic coding tools.'''
    all_cards = hand + community_cards
    suits = [card.suit for card in all_cards]
    ranks = [card.rank for card in all_cards]

    rank_values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14}
    
    rank_counts = Counter(ranks)
    suit_counts = Counter(suits)

    flush = any(count >= 5 for count in suit_counts.values())

    # Check for straight
    straight = False
    straight_high = None
    straight_ranks = sorted(set(rank_values[card.rank] for card in all_cards))
    if len(straight_ranks) >= 5:

        if set(straight_ranks) == {2, 3, 4, 5, 14}:  # Ace low straight
            straight = True
            straight_high = 5

        for i in range(len(straight_ranks) - 4):
            if straight_ranks[i + 4] - straight_ranks[i] == 4:
                straight = True
                straight_high = straight_ranks[i + 4]
                break
    sorted_ranks = sorted(set(rank_values[card.rank] for card in all_cards))

    if flush and straight:
        if straight_high == 14: 
            return 100  # Royal Flush
        return 90  # Straight Flush
    
    elif 4 in rank_counts.values():
        quad_rank = rank_values[rank_counts.most_common(1)[0][0]]
        return 80 + quad_rank * 0.1  # Quads (Four of a Kind)
    
    elif (len(rank_counts) == 4 or len(rank_counts) == 3) and 3 in rank_counts.values() and 2 in rank_counts.values():
        trip_rank = rank_values[rank_counts.most_common(1)[0][0]]
        pair_rank = rank_values[rank_counts.most_common(2)[1][0]]
        return 70 + trip_rank*0.1 + pair_rank*0.001  # Full House
    
    elif flush:
        common_suits = [suit for suit, count in suit_counts.items() if count >= 5]
        common_cards = [card for card in all_cards if card.suit in common_suits]
        flush_cards = [rank_values[card.rank] for card in common_cards]
        flush_cards.sort(reverse=True)
        flush_val = 0
        for i in range(0,5):
            flush_val += 0.01**((i+1))*flush_cards[i]
        return 60 + flush_val # Flush
    
    elif straight: # account for ties
        return 50 + straight_high * 0.1  # Straight
    
    elif 3 in rank_counts.values():  
        trips_rank = rank_values[rank_counts.most_common(1)[0][0]]
        kicker_ranks = [rank_values[rank] for rank, count in rank_counts.items() if count != 3]
        kicker_ranks.sort(reverse=True)
        kicker = 0
        for i in range(0,2):
            kicker += 0.01**(2*(i+1))*kicker_ranks[i]
        return 40 + trips_rank*0.1 + kicker # Trips (Three of a Kind)
    
    elif len(rank_counts) != 6 and 2 in rank_counts.values():
        pair_ranks = sorted(rank_values[rank] for rank, count in rank_counts.items() if count == 2)
        kicker_ranks = [rank_values[rank] for rank, count in rank_counts.items() if count == 1]
        kicker_ranks.sort(reverse=True)
        kicker = 0.000001*kicker_ranks[0]
        return 30 + pair_ranks[1] * 0.1 + pair_ranks[0] * 0.0001 + kicker # Two Pair
    
    elif len(rank_counts) == 6: # work on kicker 
        pair_rank = rank_values[rank_counts.most_common(1)[0][0]]
        kicker_ranks = [rank_values[rank] for rank, count in rank_counts.items() if count == 1]
        kicker_ranks.sort(reverse=True)
        kicker = 0
        for i in range(0,3):
            kicker += 0.01**(2*(i+1))*kicker_ranks[i]
        return 20 + pair_rank*0.01 + kicker  # One Pair
    
    else:
        sorted_ranks.sort(reverse=True)
        kicker = 0
        for i in range(0,5):
            kicker += 0.1**(2*(i+1))*sorted_ranks[i]
        return 10 + kicker  # High Card
```