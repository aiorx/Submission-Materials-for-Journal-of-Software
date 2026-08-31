# initially Aided using common development resources to help me learn the what is going on with this module. 
# Extensive modifications have been made my me on top of the skeleton ChatGPT created.

import socket
import os
import ast
import time

HOST = '10.50.200.195'
# HOST = "127.0.0.1"
# HOST = "localhost"
PORT = 80

your_turn_2 = r"""
██    ██  ██████  ██    ██ ██████      ████████ ██    ██ ██████  ███    ██ 
 ██  ██  ██    ██ ██    ██ ██   ██        ██    ██    ██ ██   ██ ████   ██ 
  ████   ██    ██ ██    ██ ██████         ██    ██    ██ ██████  ██ ██  ██ 
   ██    ██    ██ ██    ██ ██   ██        ██    ██    ██ ██   ██ ██  ██ ██ 
   ██     ██████   ██████  ██   ██        ██     ██████  ██   ██ ██   ████ 
                                                                           
                                                                           
"""
you_lose = r"""

██    ██  ██████  ██    ██     ██       ██████  ███████ ███████ 
 ██  ██  ██    ██ ██    ██     ██      ██    ██ ██      ██      
  ████   ██    ██ ██    ██     ██      ██    ██ ███████ █████   
   ██    ██    ██ ██    ██     ██      ██    ██      ██ ██      
   ██     ██████   ██████      ███████  ██████  ███████ ███████ 
                                                                
                                                                
                                                                

"""                                                         
                                                                
                                                                
you_win_art = r"""                                                             
                                                                
██    ██  ██████  ██    ██     ██     ██ ██ ███    ██           
 ██  ██  ██    ██ ██    ██     ██     ██ ██ ████   ██           
  ████   ██    ██ ██    ██     ██  █  ██ ██ ██ ██  ██           
   ██    ██    ██ ██    ██     ██ ███ ██ ██ ██  ██ ██           
   ██     ██████   ██████       ███ ███  ██ ██   ████           
                                                                
                                                                
"""
#code copied from chatGPT in resposne to a prompt to clear screen on all opearing systems
def clear_screen():
    # Check the operating system and execute the appropriate command
    if os.name == 'nt':  # For Windows
        os.system('cls')
    else:  # For Unix-like systems (Linux, macOS)
        os.system('clear')

def game_board_to_list(string:str):
    return ast.literal_eval(string)

def send_message(my_socket:socket.socket, user_input:str, listen_for_response = True):
    #prep message
    bytes_message = (user_input).encode("utf-8")
    #send message
    my_socket.sendall(bytes_message)
    if listen_for_response:
        #get response
        data = my_socket.recv(1024)
        return data.decode()
    else:
        return "not specified to listen for a response"

def show_game_board(game_board):
    print(f"The game board is: \n")
    print("\t===============================")
    for row in game_board:
        print("\t |", end="")
        for value in row:
            print(f" {value} |", end="")
        print("")
    print("\t===============================")
    print(""" column:   1   2   3   4   5   6   7""")    
    print("\n")

def update_game_board(game_board:str):
    fixed_response = game_board_to_list(game_board)
    return fixed_response

def check_turn(s:socket.socket):
    operation_choice = "P"
    message = operation_choice + "Pinging the server"
    send_message(s, message, listen_for_response=False)
    decoded_data = s.recv(1024).decode("utf-8")


    if decoded_data != "":
        my_player_number = decoded_data[0]
        decoded_data = decoded_data[1:]
        if my_player_number == decoded_data[7]:
            return True
        elif my_player_number == decoded_data[7]:
            return True
        else:
            return False
    else: 
        return "YOU LOSE"


    
def update_from_server(s):
    operation_choice = "R"
    #get the game board/state
    message = operation_choice + ""
    response = send_message(s, message)

    response_length = len(response)
    if response[response_length - 5:] == "False":
        response = response[:response_length - 5]
        print("GAME IS NOT OVER")
    if response[response_length - 4:] == "True":
        response = response[:response_length - 4]
        print("game is OVER")

    return update_game_board(response)


def main():
    # try:
    clear_screen()

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

        #connect
        s.connect((HOST, PORT))
        game_board = [
            
        [00000, 00000, 00000, 00000, 00000, 00000, 00000]
        , [00000, 00000, 00000, 00000, 00000, 00000, 00000]
        , [00000, 00000, 00000, 00000, 00000, 00000, 00000]
        , [00000, 00000, 00000, 00000, 00000, 00000, 00000]
        , [00000, 00000, 00000, 00000, 00000, 00000, 00000]
        , [00000, 00000, 00000, 00000, 00000, 00000, 00000]
    ]

        game_over = False
        last_checked_turn = True
        is_my_turn = True
        i_lose = False


        while not game_over:
            # clear_screen()

            check_turn_response = check_turn(s)
            # print(check_turn_response)
            if check_turn_response == "YOU LOSE":
                i_lose = True
                break
                
            else:
                is_my_turn = check_turn_response

            if is_my_turn:
                last_checked_turn = bool(is_my_turn)
                clear_screen()
                print("\n\n")

                print(your_turn_2)


                game_board = update_from_server(s)

                operation_choice = "M"
                
                #do input
                show_game_board(game_board)
                column = input("Enter the column to place your token in: ")
                message = operation_choice + column
                response = send_message(s, message)

                response_length = len(response)

                if response[response_length - 5:] == "False":
                    response = response[:response_length - 5]
                    game_over = False
                    print("game is not over")
                if response[response_length - 4:] == "True":
                    response = response[:response_length - 4]
                    game_over = True
                    print("game is over")
                    break
                # print(response)
                

                if game_over == "True":
                    print("GG")
                    break

            else:
                if last_checked_turn == True:
                    clear_screen()
                    print()
                    game_board = update_from_server(s)
                    show_game_board(game_board)

                    print("\nIt is not your turn")
                    print("Please wait for the other player to take their turn\n")
                    last_checked_turn = False
                    time.sleep(.5)
                else:
                    time.sleep(.5)

        # print(update_game_board(game_board))

        if not i_lose:
            clear_screen()
            print(you_win_art)
            s.close()
        else:
            clear_screen()
            print(you_lose)
            s.close()



            

if __name__ == "__main__":
    main()