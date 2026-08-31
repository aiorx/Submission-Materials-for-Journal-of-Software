import pyautogui
import time
import random
import threading
import keyboard
from tkinter import Tk, Button, Label, StringVar, Entry, Checkbutton, IntVar

running = False
thread = None

def start_farming():
    global running, thread
    if running:
        return
    running = True

    commands = []
    if var_hunt.get():
        commands.append("owo hunt")
    if var_battle.get():
        commands.append("owo battle")
    if var_sell.get():
        commands.append("owo sell all")

    try:
        delay = float(delay_var.get())
    except ValueError:
        delay = 15  # fallback default

    def loop():
        time.sleep(5)  # Give user time to focus Discord
        while running:
            for cmd in commands:
                if not running:
                    break
                pyautogui.typewrite(cmd)
                pyautogui.press("enter")
                time.sleep(delay + random.uniform(-2, 2))

    thread = threading.Thread(target=loop, daemon=True)
    thread.start()

def stop_farming():
    global running
    running = False

app = Tk()
app.title("OwO Auto-Farmer")
app.geometry("300x270")


Label(app, text="Commands to spam:").pack()

var_hunt = IntVar()
Checkbutton(app, text="owo hunt", variable=var_hunt).pack()

var_battle = IntVar()
Checkbutton(app, text="owo battle", variable=var_battle).pack()

var_sell = IntVar()
Checkbutton(app, text="owo sell all", variable=var_sell).pack()

Label(app, text="Delay (seconds):").pack()
delay_var = StringVar(value="15")
Entry(app, textvariable=delay_var).pack()

Button(app, text="Start (or Ctrl+Shift+S)", command=start_farming).pack(pady=10)
Button(app, text="Stop (or Ctrl+Shift+Q)", command=stop_farming).pack()

keyboard.add_hotkey("ctrl+shift+s", start_farming)
keyboard.add_hotkey("ctrl+shift+q", stop_farming)

Label(app, text="Focus Discord before starting").pack(pady=5)
Label(app, text="Built via standard programming aids 😈").pack()

app.mainloop()
