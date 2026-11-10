# This game was built using GitHub Copilot, but notably the code
# matches this website's version almost identically:
#   https://realpython.com/python-rock-paper-scissors/

import random

while True:
    user_action = input("Enter throw (rock, paper, scissors): ")
    ai_action = random.choice(["rock", "paper", "scissors"])

    if user_action == "quit":
        print("Game has ended. Goodbye.")
        break
    
    print("
You chose {}, AI chose {}.
".format(user_action, ai_action))

    if user_action == ai_action:
        print("Both players selected {}. It's a tie!".format(user_action))
    elif user_action == "rock":
        if ai_action == "scissors":
            print("Rock smashes scissors! You win!")
        else:
            print("Paper covers rock! You lose.")
    elif user_action == "paper":
        if ai_action == "rock":
            print("Paper covers rock! You win!")
        else:
            print("Scissors cuts paper! You lose.")
    elif user_action == "scissors":
        if ai_action == "paper":
            print("Scissors cuts paper! You win!")
        else:
            print("Rock smashes scissors! You lose.")