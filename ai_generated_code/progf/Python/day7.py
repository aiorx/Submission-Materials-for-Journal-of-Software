from helpers import *
from itertools import product


# Thanks ChatGPT!
def parse_poker_hand(hand):
    # Check if the hand is valid (contains exactly 5 cards)
    if len(hand) != 5:
        return "Invalid hand: Must contain exactly 5 cards."

    # Count occurrences of each card value
    card_counts = {}
    for card in hand:
        card_counts[card] = card_counts.get(card, 0) + 1

    # Check for various poker hand types
    if 5 in card_counts.values():
        return 1 #"Five of a kind"
    elif 4 in card_counts.values():
        return 2 #"Four of a kind"
    elif 3 in card_counts.values() and 2 in card_counts.values():
        return 3 #"Full house"
    elif 3 in card_counts.values():
        return 4 #"Three of a kind"
    elif list(card_counts.values()).count(2) == 2:
        return 5 #"Two pair"
    elif 2 in card_counts.values():
        return 6 #"One pair"
    else:
        return 7 #"High card"
    

def parse_poker_hand_jokers(hand):
    # Check if the hand is valid (contains exactly 5 cards)
    if len(hand) != 5:
        return "Invalid hand: Must contain exactly 5 cards."


    # count numebr of jokers
    nJokers = hand.count('J')
    #remove the jokers
    jokerlessHand = hand.replace('J', '')

    # Count occurrences of each card value
    card_counts = {}
    for card in hand:
        card_counts[card] = card_counts.get(card, 0) + 1


    card_counts_with_jokers = {}
    for card in jokerlessHand:
        card_counts_with_jokers[card] = card_counts_with_jokers.get(card, 0) + 1
    #add jokers
    for card in card_counts_with_jokers:
        card_counts_with_jokers[card] += nJokers

    # Check for various poker hand types
    if 5 in card_counts_with_jokers.values() or 5 in card_counts.values():
        return 1 #"Five of a kind"
    elif 4 in card_counts_with_jokers.values():
        return 2 #"Four of a kind"
    elif (3 in card_counts.values() and 2 in card_counts.values()) or \
         (list(card_counts.values()).count(2) == 2 and nJokers == 1):
        return 3 #"Full house" = original full house, or 2 pair plus joker
    elif 3 in card_counts_with_jokers.values():
        return 4 #"Three of a kind"
    elif list(card_counts.values()).count(2) == 2:
        return 5 #"Two pair"
    elif 2 in card_counts_with_jokers.values():
        return 6 #"One pair"
    else:
        return 7 #"High card"


#def parse_poker_hand_with_jokes2(hand):
    # create list of hands for each hand changing joker to an actual card, calculate the type, then pick the highest


# Thanks again ChatGPT!
def convertHandToAlpha(hand):
    card_mapping = {'A': 'A', 'K': 'B', 'Q': 'C', 'J': 'D', 'T': 'E', '9': 'F', '8': 'G', '7': 'H', '6': 'I', '5': 'J', '4': 'K', '3': 'L', '2': 'M'}
    
    # Use a list comprehension to map each character
    mapped_string = ''.join(card_mapping.get(card, card) for card in hand)
    
    return mapped_string

def convertHandToAlphaWithJokers(hand):
    card_mapping = {'A': 'A', 'K': 'B', 'Q': 'C', 'T': 'D', '9': 'E', '8': 'F', '7': 'G', '6': 'H', '5': 'I', '4': 'J', '3': 'K', '2': 'L', 'J': 'M'}
    
    # Use a list comprehension to map each character
    mapped_string = ''.join(card_mapping.get(card, card) for card in hand)
    
    return mapped_string

def custom_sort(item):
    return (item['pokerType'], item['alphaHand'])

def ParseAndOrderHands(lines):
    # originalHand, alphaHand, pokerType, bid
    hands = []
    for line in lines:
        hand = line.split(' ')[0]
        bid = int(line.split(' ')[1])
        hands.append({
            'hand': hand, 
            'pokerType': parse_poker_hand(hand), 
            'alphaHand': convertHandToAlpha(hand),
            'bid': bid
        })
    return sorted(hands, key=custom_sort)


def ParseAndOrderHandsWithJokers(lines):
    # originalHand, alphaHand, pokerType, bid
    hands = []
    for line in lines:
        hand = line.split(' ')[0]
        bid = int(line.split(' ')[1])
        data = {
            'hand': hand, 
            'pokerType': parse_poker_hand_jokers(hand), 
            'alphaHand': convertHandToAlphaWithJokers(hand),
            'bid': bid
        }
        hands.append(data)
    return sorted(hands, key=custom_sort)


def CalculateTotalWinnings(hands):
    totalWinnings = 0
    for rank, hand in enumerate(reversed(hands)):
        totalWinnings += (rank+1)*hand['bid']
    return totalWinnings





def Part1(file):
    lines = readFileAsLines(file)
    hands = ParseAndOrderHands(lines)
    totalWinnings = CalculateTotalWinnings(hands)
    return totalWinnings


def Part2(file):
    lines = readFileAsLines(file)
    hands = ParseAndOrderHandsWithJokers(lines)
    totalWinnings = CalculateTotalWinnings(hands)
    return totalWinnings





####################

day = get_day(__file__)

# Part 1 Sample Answer: 6440
part1SampleResult = Part1(day + '/sample.txt')
log('Part 1 Sample: ' + str(part1SampleResult))
part1Result = Part1(day + '/input.txt')
log('Part 1: ' + str(part1Result))


# Part 2 Sample Answer: 5905
part2SampleResult = Part2(day + '/sample.txt')
log('Part 2 Sample: ' + str(part2SampleResult))
part2Result = Part2(day + '/input.txt')
log('Part 2: ' + str(part2Result))

# Output - Attempt 1
# Attempt1: 249071353 is too low - method used ranking like hands with J as lowest value
# 2023-12-19 23:19:39: day7
# 2023-12-19 23:19:39: Part 1 Sample: 6440
# 2023-12-19 23:19:39: Part 1: 250232501
# 2023-12-19 23:19:41: Part 2 Sample: 5905
# 2023-12-19 23:22:15: Part 2: 249071353

# Output - Attempt 2
# Attempt2: 249228192 is too high - method used ranking like hands the same as they were
# 2023-12-20 10:36:22: day7
# 2023-12-20 10:36:24: Part 1 Sample: 6440
# 2023-12-20 10:36:24: Part 1: 250232501
# 2023-12-20 10:36:24: Part 2 Sample: 5905
# 2023-12-20 10:36:24: Part 2: 249228192

# Output - Attempt 3
# Attempt3: there is a hand with a jokers JJJJJ (last line in the part2debug.txt file), which my logic treated as just high card, but really it is a 5 of a kind, also revert back the like hand ranking logic
# 2023-12-20 10:42:43: day7
# 2023-12-20 10:42:43: Part 1 Sample: 6440
# 2023-12-20 10:42:43: Part 1: 250232501
# 2023-12-20 10:42:43: Part 2 Sample: 5905
# 2023-12-20 10:42:43: Part 2: 249138943




