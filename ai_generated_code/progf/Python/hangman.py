"""File Aided using common development resources.
Minor edits made by human hand.
"""
"""
### ERROR FIX(?): https://www.codeproject.com/Questions/5366129/Error-closing-main-tkinter-window-with-destroy
"""

import random
import tkinter as tk
from tkinter import messagebox
import json


def choose_word():
    """Picks a word from 'words.json' at random."""
    try:
        with open("words.json", "r") as file:
            data = json.load(file)
            words = [item["word"] for item in data["data"]]

            # Randomly pick a word
            return random.choice(words).lower()

    except Exception as e:
        print(f"Error reading words from JSON file: {e}")
        return random.choice(["python", "hangman", "programming", "computer", "game", "code"])


def show_message(title, message):
    messagebox.showinfo(title, message)


class HangmanGameGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Hangman Game")

        self.create_widgets()
        self.play_game()

    def create_widgets(self):
        # Word to guess
        self.word_label = tk.Label(self.root, text="", font=("Helvetica", 18))
        self.word_label.pack(pady=10)

        # Incorrect guess
        self.incorrect_label = tk.Label(self.root, text="Incorrect Guesses: ", font=("Helvetica", 12))
        self.incorrect_label.pack()

        # Attempts remaining
        self.attempts_label = tk.Label(self.root, text="", font=("Helvetica", 12))
        self.attempts_label.pack()

        # Instruction
        self.guess_label = tk.Label(self.root, text="Guess a letter or the entire word:", font=("Helvetica", 12))
        self.guess_label.pack()

        # Input -- guess letter or word
        self.guess_entry = tk.Entry(self.root, font=("Helvetica", 12))
        self.guess_entry.pack()

        # Button
        self.guess_button = tk.Button(self.root, text="Guess", command=self.make_guess, font=("Helvetica", 12))
        self.guess_button.pack(pady=10)

        # Bind the Enter key to the make_guess function
        """Pressing the 'ENTER-key' submits the input ('Guess')."""
        self.root.bind('<Return>', lambda event=None: self.make_guess())

    def play_game(self):
        self.word_to_guess = choose_word()
        self.good_guess = []
        self.bad_guess = []
        self.attempts = 10

        self.update_labels()

    def replay_game(self):
        replay = messagebox.askyesno("Replay", "Do you want to play again?")
        if replay:
            self.incorrect_label.config(text="Incorrect Guesses: ")
            self.play_game()
        else:
            self.root.destroy()

    def display_word(self):
        return ' '.join([letter if letter in self.good_guess else '_' for letter in self.word_to_guess])

    def make_guess(self):
        """Check to see if guess was correct, incorrect, or invalid (Error)."""
        guess = self.guess_entry.get().lower()

        # Invalid guess
        if not self.is_valid_input(guess):

            messagebox.showinfo("Invalid Input", "Please enter a single letter or the entire word.")
            # Clear entry after invalid guess -- NEEDED FOR CLEARING AFTER INVALID ENTRY
            self.guess_entry.delete(0, 'end')
            return

        # Guess letter
        if len(guess) == 1:
            self.process_letter_guess(guess)
        # Guess word
        else:
            self.process_word_guess(guess)

        # Clear the entry after processing the guess
        self.guess_entry.delete(0, 'end')

    # Process LETTER
    def process_letter_guess(self, guess):
        # Already guessed
        if self.already_guessed(guess):
            messagebox.showinfo("Duplicate Guess", "You've already guessed that letter. Try again.")
            return

        # Guess -> Correct
        if guess in self.word_to_guess:
            self.good_guess.append(guess)
        # Guess -> Incorrect
        else:
            self.attempts -= 1
            self.bad_guess.append(guess)
            self.incorrect_label.config(text=f"Incorrect Guesses: {', '.join(self.bad_guess)}")

        self.update_labels()
        self.check_game_result()

    # Process WORD
    def process_word_guess(self, guess):
        # Game won
        if guess == self.word_to_guess:
            show_message("Congratulations", f"You guessed the word: {self.word_to_guess}")
            self.replay_game()
        else:
            self.attempts -= 1
            self.update_labels()
            self.check_game_result()

    def is_valid_input(self, guess):
        """Check to see if input (Guess) is a valid guess."""
        return len(guess) == 1 and guess.isalpha() or len(guess) == len(self.word_to_guess) and guess.isalpha()

    # Guessed letters
    def already_guessed(self, guess):
        return guess in self.good_guess or guess in self.bad_guess

    def check_game_result(self):
        # Game won
        if set(self.good_guess) == set(self.word_to_guess):
            show_message("Congratulations", f"You guessed the word: {self.word_to_guess}")
            self.replay_game()

        # Game lost
        if self.attempts == 0:
            show_message("Game Over", f"Sorry, you ran out of attempts. The word was: {self.word_to_guess}")
            self.replay_game()

    def update_labels(self):
        current_display = self.display_word()
        self.word_label.config(text=current_display)
        self.attempts_label.config(text=f"Attempts left: {self.attempts}")


if __name__ == "__main__":
    root = tk.Tk()
    root.geometry("500x400")  # Set the window dimensions
    hangman_game = HangmanGameGUI(root)
    root.mainloop()
