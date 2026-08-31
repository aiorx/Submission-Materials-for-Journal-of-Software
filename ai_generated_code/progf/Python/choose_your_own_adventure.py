# Evan's House of Horrors
# Program and storyline by Evan Prael
#
# Description: This program is a text-based adventure game.  The user is transported to a dark basement
#              and must try to escape.  Traps at every turn can end the game.
#              There are 3 rooms to get through. Each room has its own set of options and a hint.
#              A player can also quit any time.
#
# Program written with A LOT OF HELP from Github CoPilot, especially 
#   - all the screen functions (coloring, positioning, clearing)
#   - many of the descriptions for all the rooms
#   - the main play_room function almost wrote itself, but I did have to update it 
#   - code for accessing or looping throug the data collection
# Date: 1/20/2024
# Tested in Visual Studio Code for Windows

# Answer Key to reach the end:
# 4. Flick the switch
# 2. Open the Steel Door
# 4. Explore the bookshelf
# 2. Pickup the red book
# 2. Go up the stairs
# 5. Play the piano
# 1. Open the front door

# for the room data collection, each room has a:
#   room id
#   room name
#   description
#   list of possible actions
#   hint for the player

# actions are made up of:
#   the action text
#   a message to display after the action
#   the room that the action leads to

# when running, the program 
#    displays an introduction
#    sets the room and the previous room's action message ("basement", "")
#    repeatedly calls the "play_room" function until the game is over

# the "play_room" function handles all activity for a room. 
# given a room_id and an action message from a previous room, it:
#
#   gets the room data from the room data collection 
#   displays the room name as a header 
#   displays the action message from the previous room, if there is one
#   displays the room description
#   displays the list of available actions for that room, including the option to quit or get a hint
#   while there is no room change
#      prompts the user to make a selection (until selection is in range)
#      if the selection is 'q' (to quit), it returns with "player_quits"
#      if the selection is 'h' (hint), it displays the hint for the room
#      gets the action data from the room's action list
#
#      if the action leads to a new room
#         returns the action's next room and action message
#      else 
#         displays the action's message and stays in the room

# Some actions lead to a new version of the same room.  
# This happens when a light is turned on or a box is opened 

# support for using ansii escape codes to print text in color
import os
os.system("")

# allows use of sleep function
import time

# allow for random prompts
import random

game_title = "Evan's House of Horrors!"

introduction = """You have been mysteriously transported to a dark basement of some old forgotten mansion.  
You must try to escape and find your way out.  But careful!! There are traps at every turn!  One wrong move and 
it's game over!  If you're worried about making a bad choice, try pressing 'h' for a hint.  You can also press 'q'
any time to quit."""

chest_action = """Oh oh.  The chest begins to shake!  A green gas drifts up and surrounds you in a thick fog.  
You feel weak and faint and are overcome by darkness.  You didn't make it."""

blue_book_action = """Oh oh. The blue book suddenly glows brighter and starts to make a terribe noise. 
Suddenly it explodes in a giant ball of fire.  You didn't make it."""

green_book_action = "The green book floats up from your hands, starts spinning, and returns itself to the shelf!"

closet_action = """Oh oh. An old vacuum at the bottom of the closet suddenly comes to life.  Its hose lifts magically into the air
and wraps itself around your neck! It sucks you in and - poof! You're gone.  You didn't make it."""

piano_action = "Most of the piano keys are broken. But as you play, a click can be heard by the front door!"

# variables to make it easier to read and access list data
idx_room_id = 0
idx_room_name = 1
idx_room_description = 2
idx_room_actions = 3
idx_room_hint = 4

idx_action_name = 0
idx_action_message = 1
idx_action_new_room = 2

new_line = "\r\n"

# ------------------------- GAME DATA --------------------------------------------

room_data = [ 
              [
               "basement_dark", "basement storage room", 
"""You're not sure how you got here. It is quite dark and there's water dripping in the distance.  
There's a door to your left and a door to your right.  There's also a chest in the corner with a 
strange hum coming from it.""",
                # player options: action, message, name of next room
                [
                    ["Open the left door","The left door is locked.",""],
                    ["Open the right door","The right door is locked.",""],
                    ["Open the chest","The chest is locked.",""],
                    ["Flick the light switch on the wall","The lights are now on.","basement_light"]
                ],
                # hint
                "Any option is safe."
              ],
              
              ["basement_light", "basement storage room", 
"""The left door appears to be made of wood, while the right one is made of steel. You also notice 
an odd key lying on the chest. The hum from the chest just got louder.""",
                # player options: action, message, name of next room
                [
                    ["Use key on wooden door","No luck. The door is still locked.",""],
                    ["Use key on steel door","Click! It worked! The door opens and an invisible force pushes you through...","basement_library_1"],
                    ["Use key on chest", chest_action,"player_dies"]
                ],
                # hint
                "A chest that hums? Might be more trouble than it's worth."
              ],
              ["basement_library_1", "basement library", 
"""You've come to a room full of artifacts.  It appears to be some kind of library.  There's a big book shelf 
at the back wall. There's also a mysterious statue on the table and another small chest in the corner.""",
                [
                    ["Go back to the previous room.","You're back where you started.","basement_light"],
                    ["Pickup and study the statue","The statue feels old. It's cracked and seems to be looking at you funny.",""],
                    ["Open the chest", chest_action,"player_dies"],
                    ["Check out the book shelf","You cross the room and make your way to the big bookshelf.","basement_library_2"],
                ],
                "Book shelves are always interesting."
              ],
              ["basement_library_2", "basement library", 
"""There are 100s of books - all covered in dust. A couple books appear out of place.  
A red book sticks out half way. A blue book seems to be glowing, and a green book is placed upside down.""",
                [
                    ["Pick up and study the green book",green_book_action,""],
                    ["Pick up and study the red book","""You pull out the red book and hear a sudden rumbling behind the wall. The bookshelf is rotating!""","basement_library_3"],
                    ["Pick up and study the blue book", blue_book_action,"player_dies"],
                    ["Go back to the previous room.","You're back where you started.","basement_light"]
                ],
                "Glowing books are always bad news. Probably best to leave those alone."
              ],
              ["basement_library_3", "basement library", 
               "A secret compartment is revealed behind the book shelf and you see a spiral staircase leading up.",
                [
                    ["Put the red book back.","The book is back and the bookshelf has rotated back into place.","basement_library_2"],
                    ["Go up the spiral stair case","You make your way up the stairs.","upstairs_locked"],
                    ["Pick up and study the green book",green_book_action,""],
                    ["Pick up and study the blue book",blue_book_action,"player_dies"],
                    ["Go back to the previous room.","You're back where you started.","basement_light"]
                ],
                "Well, the stairs do seem to be the only way out..."
              ],
              ["upstairs_locked", "Upstairs Living Room", 
"""You've found your way out of the basement!  You're now in a large open room with a piano in the corner, 
a grandfather clock by the window, and a half-open closet opposite the piano.  No one has been here in years.  
You also see the front door to your left.""",
                [
                    ["Open the front door","The front door is locked.",""],
                    ["Go back downstairs","You make your way back to the library.","basement_library_3"],
                    ["Check out the grandfather clock","The clock appears to be broken.",""],
                    ["Open the closet",closet_action,"player_dies"],
                    ["Play the piano", piano_action,"upstairs_unlocked"]
                ],
                "Some believe half-open closets are bad luck. Maybe they're right."
              ],
              ["upstairs_unlocked", "Upstairs Living Room", "",
                [
                    ["Open the front door","","player_wins"],
                    ["Check out the grandfather clock","The clock appears to be broken.",""],
                    ["Open the closet",closet_action,"player_dies"],
                    ["Go back downstairs","You make your way back down the spiral stair case.","basement_library_3"],
                    ["Play the piano", piano_action,""]

                ],
                "A click by the front door?  You're almost there.  Only one thing left to do!"
              ]
            ]


# ------------ SCREEN FUNCTIONS -------------------------

# see https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x361.html
# code filled in Aided via basic GitHub coding utilities!  Thank you!
def move_cursor(direction,amount):
  if (direction == "up"):
    print ("\033[" + str(amount) + "A", end="")
  elif (direction == "down"):
    print ("\033[" + str(amount) + "B", end="")
  elif (direction == "right"):
    print ("\033[" + str(amount) + "C", end="")
  elif (direction == "left"):
    print ("\033[" + str(amount) + "D", end="")


# Aided via basic GitHub coding utilities
def clear_screen():
  print ("\033[2J\033[0;0f", end="")

# Aided via basic GitHub coding utilities
def clear_to_end_of_screen():
  print ("\033[J", end="")

# Aided via basic GitHub coding utilities
def clear_to_end_of_line():
  print ("\033[K", end="")


# This function adds color codes to a string for printing 
# by Gitub Copilot

# Valid colors: black, red, green, yellow, blue, purple, cyan, white.
# Valid styles: regular, bold, underline.
# Valid intensities: normal, high.
def colorize(color, style, intensity, text):

  txt_colors = {
      # regular, high-intensity
    "black": ["30","90"],
    "red": ["31","91"],
    "green": ["32","92"],
    "yellow": ["33","93"],
    "blue": ["34","94"],
    "purple" : ["35","95"],
    "cyan" : ["36","96"],
    "white" : ["37","97"]
  }
  txt_styles      = {"regular": "0", "bold": "1", "underline": "4" }
  txt_intensities = {"normal": "0","high": "1"}

  return "\033[{0};{1};{2}m{3}\033[0m".format(
        txt_intensities[intensity],
        txt_styles[style],
        txt_colors[color][int(txt_intensities[intensity])],
        text
    )


# ------------ GAME FUNCTIONS -------------------------

def show_introduction():
  clear_screen()
  print (colorize("cyan","underline","high", f"Welcome to {game_title}") + new_line)
  print (introduction + new_line)
  print (colorize("green","regular","normal", "Good luck!") + new_line)
  input ("Press Enter to begin.")

def show_error (message):
  print (new_line + colorize("red","regular","high", message) + new_line)

def get_room_data(room_id):
  for room in room_data:
    if room[idx_room_id] == room_id:
      return room
  return None

def player_dies (message_from_previous_room):
   clear_to_end_of_screen()
   print ("")
   print (colorize("red","regular","high", message_from_previous_room) + new_line)
   time.sleep(1.5)
   print (colorize("red","regular","high", "Game Over."))
   time.sleep(1)
   return play_again()

def player_wins():
   clear_screen()
   print (colorize("cyan","underline","high","THE FRONT YARD") + new_line)
   print (colorize("yellow","regular","normal","You open the front door and a gust of fresh air welcomes you to the front yard!") + new_line)  
   time.sleep(1)
   print (colorize("green","regular","high",f"Congratulations, you've escaped {game_title}!") + new_line)
   time.sleep(0.5)
   return play_again()

def play_again():
   print ("")
   playagain = input(colorize("purple","regular","high","Play again? (y/n)"))
   if playagain == "y":
     return True
   else:
     return False

#--------------------------------------------------------------------------
# main game function
#--------------------------------------------------------------------------
def play_room(room_id, message_from_previous_room, isFirstRoom):

  # get room data
  room_data = get_room_data(room_id)

  # if room not found, show error and end game
  if (room_data == None):
    show_error ("Program error: Room " + room_id + " not found.  Aborting game.")
    exit()

  clear_screen()

  # show room name
  print (colorize("cyan","underline","high",(room_data[idx_room_name]).upper()) + new_line)

  # show message from previous room if there is one
  if message_from_previous_room != "":
    print (colorize("yellow","regular","normal", message_from_previous_room) + new_line)
    time.sleep(1)

  # show room description / describe the scene
  if room_data[idx_room_description] != "":
    print (room_data[idx_room_description])
    time.sleep(0.5)

  print ("")

  # ask user what to do
  # for first room, prompt is set, for the rest it's random
  user_prompts = ["What do you want to do?", "What's next?", "Now what?", "And now?"]
  if isFirstRoom:
    promptIdx = 0
  else:
    promptIdx = random.randrange(0,len(user_prompts))

  print (user_prompts[promptIdx] + new_line)

  # show room actions
  action_number = 1
  for action in room_data[idx_room_actions]:
    print (str(action_number) + ". " + action[idx_action_name])
    action_number += 1

  # show quit and hint options
  print ("")
  print ("h: hint")
  print ("q: quit")
  print ("")

  # stay in this room until player quits or goes to another room
  while True:
    # get user input
    choice_made = False
    while not choice_made:

      # clear previous input
      clear_to_end_of_line()

      # show input prompt
      choice = input("Enter your choice: ")

      clear_to_end_of_screen()

      # check if user wants to quit
      if choice == "q":
        return ["player_quits",""]

      if choice == "h":
        print (new_line + colorize("green","regular","normal", room_data[idx_room_hint]))
        move_cursor("up",3)
        continue

      # make sure input is a number between 1 and the number of options
      try:
        # convert choice to integer - if it fails, it's not a number and program jumps to except
        choice = int(choice)
        # check if number is out of range
        if choice < 1 or choice > len(room_data[idx_room_actions]):
          show_error ("Please enter a number between 1 and " + str(len(room_data[idx_room_actions])) + ".")
          move_cursor("up",4)
        else:
          choice_made = True
      except:
        # ignore error
        show_error ("")
        move_cursor("up",4)

    # get info for selected action.  Subtract 1 from choice as list starts at 0
    action = room_data[idx_room_actions][choice-1]

    # if action leads to new room id, return room_id and action message
    if action[idx_action_new_room] != "":
        return [action[idx_action_new_room], action[idx_action_message]]

    # show action message in blue, if there is one
    if action[idx_action_message] != "":
      print ("")
      print (colorize("blue","regular","high", action[idx_action_message]))
      # go back to input prompt
      move_cursor("up",3)


#-------------- MAIN PROGRAM  --------------------

playAgain = True 

while playAgain:
  show_introduction()
  current_room = "basement_dark" 
  action_message = ""
  isFirstRoom = True

  while current_room != "the_end":

    # call play_room with current_room and previous room's action message.
    # returns a new room and action message
    next_room_data = play_room(current_room, action_message, isFirstRoom)

    next_room = next_room_data[0]
    action_message = next_room_data[1]
    isFirstRoom = False
    
    if (next_room == "player_dies"):
        current_room = "the_end"
        playAgain = player_dies(action_message)
    elif (next_room == "player_wins"):  
        current_room = "the_end"
        playAgain = player_wins()
    elif (next_room == "player_quits"):
        current_room = "the_end"
        print (new_line + colorize("green","regular","high", "Quit?!?  Ok, no problem! See you next time!"))
        playAgain = False
    else:
        current_room = next_room

print (new_line + "Thanks for playing!" + new_line)
