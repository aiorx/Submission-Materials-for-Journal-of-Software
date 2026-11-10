# Trying to solve jerky mouse wheel scrolling
# Produced via common programming aids-4

import tkinter as tk

def on_scroll(event):
    global up_count, down_count

    # Different platforms handle scroll events differently, so we handle each case
    # event.delta is typically used in Windows & MacOS, whereas event.num is used in Linux
    # event.num:4 is UP; event.num:5 is DOWN
    delta = event.delta if event.delta != 0 else (-1 if event.num == 5 else 1)

    # Increment UP or DOWN counts based on the scroll direction
    if delta > 0:
        up_count += 1
        up_label.config(text="UP Scrolls: " + str(up_count))
    else:
        down_count += 1
        down_label.config(text="DOWN Scrolls: " + str(down_count))

def reset_counts():
    global up_count, down_count
    up_count = 0
    down_count = 0
    up_label.config(text="UP Scrolls: 0")
    down_label.config(text="DOWN Scrolls: 0")

up_count = 0
down_count = 0

# Create main window
root = tk.Tk()
root.title("Scroll Wheel Test")
root.geometry("400x200")

# Frame to center the content in the window
frame = tk.Frame(root)
frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)

# Up & Down labels
up_label = tk.Label(frame, text="UP Scrolls: 0")
up_label.pack()
down_label = tk.Label(frame, text="DOWN Scrolls: 0")
down_label.pack()

# Reset button to clear the counts
reset_button = tk.Button(frame, text="Reset", command=reset_counts)
reset_button.pack()

# Bind scroll events to the on_scroll function
# These handle different platforms' scroll event behaviors
root.bind("<MouseWheel>", on_scroll) # Windows & MacOS
root.bind("<Button-4>", on_scroll) # Linux scroll up
root.bind("<Button-5>", on_scroll) # Linux scroll down

# Start main event loop
root.mainloop()
