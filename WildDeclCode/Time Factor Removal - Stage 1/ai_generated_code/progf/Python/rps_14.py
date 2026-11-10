# This game was built using GitHub Copilot, but notably the code
# matches this website's version almost identically:
#   https://realpython.com/python-rock-paper-scissors/

import random

user_action = input("Enter throw (rock, paper, scissors): ")
# ai_action = random.choice(["rock", "paper", "scissors"])
ai_action = "rock"

print("
You chose {}, AI chose {}.
".format(user_action, ai_action))

while (True):
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
    if (input("Do you want to play again? y/n: ") == 'n'):
        break
