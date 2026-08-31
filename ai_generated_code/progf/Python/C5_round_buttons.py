from tkinter import *


# Designed via basic programming aids
class RoundedButton(Canvas):
    def __init__(self, parent, text, command, **kwargs):
        self.bg_color = kwargs.pop("bg", "#000000")
        self.pressed_bg_color = kwargs.pop("pressed_bg", "#555555")
        self.fg_color = kwargs.pop("fg", "#FFFFFF")
        self.font = kwargs.pop("font", ("Georgia", 11))
        self.radius = kwargs.pop("radius", 20)
        self.width = kwargs.pop("width", 100)
        self.height = kwargs.pop("height", 40)

        super().__init__(parent, width=self.width, height=self.height, bg=parent["bg"], highlightthickness=0, **kwargs)

        self.command = command
        self.text = text

        self.button_bg = self.create_rounded_rectangle(0, 0, self.width, self.height, self.radius, fill=self.bg_color)
        self.text_id = self.create_text(self.width // 2, self.height // 2, text=self.text,
                                        fill=self.fg_color, font=self.font)

        self.bind("<Button-1>", self.on_press)
        self.bind("<ButtonRelease-1>", self.on_release)

    def create_rounded_rectangle(self, x1, y1, x2, y2, r, **kwargs):
        points = [x1 + r, y1, x1 + r, y1, x2 - r, y1, x2 - r, y1, x2, y1, x2, y1 + r, x2, y1 + r, x2, y2 - r,
                  x2, y2 - r, x2, y2, x2 - r, y2, x2 - r, y2, x1 + r, y2, x1 + r, y2, x1, y2, x1, y2 - r, x1, y2 - r,
                  x1, y1 + r, x1, y1 + r, x1, y1]
        return self.create_polygon(points, **kwargs, smooth=True)

    def update_text(self, new_text):
        self.itemconfig(self.text_id, text=new_text)

    def on_press(self, event):
        self.itemconfig(self.button_bg, fill=self.pressed_bg_color)
        self.move(self.text_id, 1, 1)

    def on_release(self, event):
        self.itemconfig(self.button_bg, fill=self.bg_color)
        self.move(self.text_id, -1, -1)
        self.command()


# create simple GUI for testing rounded buttons
class Play:
    def __init__(self, root):
        self.root = root
        self.root.title("The Fear Test")

        self.gui_frame = Frame(padx=10, pady=10)
        self.gui_frame.grid()

        # Create Play button
        play_button = RoundedButton(self.gui_frame, "Play", self.play, bg="#4CAF50", fg="#FFFFFF", font=("Arial", 12),
                                    width=120, height=50)
        play_button.grid(row=0, column=0, padx=5, pady=5)

        # Create Quit button
        quit_button = RoundedButton(self.gui_frame, "Quit", self.quit_app, bg="#F44336", fg="#FFFFFF",
                                    font=("Arial", 12), width=120, height=50)
        quit_button.grid(row=0, column=1, padx=5, pady=5)

    # function for play button
    def play(self):
        print("Play button pressed!")

    # function for quit button
    def quit_app(self):
        self.root.destroy()

# main routine
if __name__ == "__main__":
    root = Tk()
    app = Play(root)
    root.mainloop()
