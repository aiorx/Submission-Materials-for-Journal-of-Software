# This code was mostly Aided using common development resources and debugged by me. It produced it in response to my original code along with this question:
#### the following python code **is working**, but I wonder if the approach I took was the right one. In particular, I would have preferred to avoid global variables, but I understand that sometimes they're necessary.
#### What would you have done differently and why? Would you have taken an Object-Oriented approach to this problem?

import tkinter as tk
from tkinter import filedialog, ttk
from PIL import Image, ImageTk, ImageDraw, ImageFont

class WatermarkerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("The Watermarker App")
        self.root.geometry('650x650')
        self.alignments = ["Top-Left", "Top-Right", "Bottom-Left", "Bottom-Right"]
        self.file_path = None
        self.inp = None
        self.align = self.alignments[0]
        self.create_widgets()

    def create_widgets(self):
        # ... (your existing widget creation code)
        # Label in grid position 0, 0
        self.label_welcome = tk.Label(self.root, text="Welcome to the watermarker app!")
        self.label_welcome.grid(row=0, column=0, columnspan = 3)

        # Button to select a file in grid position 1, 0
        self.button_select = tk.Button(self.root, text="Select File", command = self.select_file)
        self.button_select.grid(row=1, column=0, columnspan = 3)
        
        # Label to display the path of the selected file in grid position 2, 0
        self.label_path = tk.Label(self.root, text="Selected File: ", wraplength = 450)
        self.label_path.grid(row=2, column=0, columnspan = 3)
        
        # Image display in grid position 3, 0
        self.label_image = tk.Label(self.root)
        self.label_image.grid(row=3, column=0, columnspan = 3)
        
        # get watermark text in grid position 4, 0
        self.watermark_text = tk.Text(self.root, height = 1, width = 32)
        self.watermark_text.grid(row = 4, column = 0)
        
        # get watermark alignment in grid position 4, 1
        self.watermark_alignment = ttk.Combobox(self.root, width = 12, values=self.alignments, state="readonly")
        self.watermark_alignment.grid(row = 4, column = 1)
        self.watermark_alignment.set(self.alignments[0])
        
        # confirm button for watermark text
        self.watermark_confirm = tk.Button(self.root, text = "Submit", command = self.print_confirmation)
        self.watermark_confirm.grid(row = 4, column = 2)
        
        # print watermark chain in grid position 5, 0
        self.confirmation_label = tk.Label(self.root)
        self.confirmation_label.grid(row = 5, column =  0, columnspan = 3)
        
        # Quit button in grid position 6, 0
        self.button_quit = tk.Button(self.root, text="Quit", command = self.quit_app)
        self.button_quit.grid(row=6, column=0)
        
        # Process image button in grid position 6, 1
        self.button_process = tk.Button(self.root, text = "Process", command = self.process_image)
        self.button_process.grid(row = 6, column = 1)
        self.button_process.config(state = "disabled")


    def select_file(self):
        self.file_path = filedialog.askopenfilename()
        self.label_path.config(text=f"Selected File: {self.file_path}")

        # Display the image
        try:
            image = Image.open(self.file_path)
            image = image.resize((450, 450), Image.ANTIALIAS)
            tk_image = ImageTk.PhotoImage(image)
            self.label_image.config(image=tk_image)
            self.label_image.image = tk_image
        except Exception as e:
            print(f"Error loading image: {e}")

    def quit_app(self):
        self.root.destroy()

    def print_confirmation(self):
        self.inp = self.watermark_text.get(1.0, "end-1c")
        self.align = self.watermark_alignment.get() 
        self.confirmation_label.config(text=f"Provided Input: '{self.inp}', to be located in {self.align}.")
        self.button_process.config(state="active")

    def process_image(self):
        img = Image.open(self.file_path)
        w, h = img.size
        alignment = {"Top-Left": (10, 10), "Top-Right": (w-10, 10), "Bottom-Left": (10, h-10), "Bottom-Right": (w-10, h-10)}
        anchors = {"Top-Left": "lt", "Top-Right": "rt", "Bottom-Left": "lb", "Bottom-Right": "rb"}
        draw = ImageDraw.Draw(img)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size=18)
        location = alignment[self.align]
        draw.text(location, self.inp, (0, 0, 0), font=font, anchor=anchors[self.align])
        output_path = filedialog.asksaveasfile(mode="w", defaultextension=(".jpg"))
        img.save(output_path)
        self.button_process.config(state="disabled")

if __name__ == "__main__":
    root = tk.Tk()
    app = WatermarkerApp(root)
    root.mainloop()
