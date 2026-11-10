'''
A script to check the pickle files with a GUI
Penned via standard programming aids entirely
'''
import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
import pickle
import io


class PickleEditorApp:
    def __init__(self, master):
        self.master = master
        self.master.title("Pickle File Editor")
        self.master.geometry("1000x800")  # Set initial size of the window

        self.text_area = tk.Text(master, height=50, width=120)
        self.text_area.pack(pady=10)

        self.load_button = tk.Button(master, text="Load Pickle File", command=self.load_pickle)
        self.load_button.pack()

        self.save_button = tk.Button(master, text="Save Changes", command=self.save_pickle)
        self.save_button.pack()

        self.data = None
        self.file_path = None

    def load_pickle(self):
        file_path = filedialog.askopenfilename(filetypes=[("Pickle Files", "*.pkl")])
        if file_path:
            try:
                self.file_path = file_path
                with open(file_path, 'rb') as file:
                    self.data = pickle.load(file)
                    self.text_area.delete('1.0', tk.END)
                    self.text_area.insert(tk.END, str(self.data))  # Display DataFrame as string
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load pickle file: {e}")

    def save_pickle(self):
        if self.data is None:
            messagebox.showerror("Error", "No data to save. Please load a pickle file first.")
            return

        new_data = self.text_area.get('1.0', tk.END)
        try:
            self.data = pd.read_csv(io.StringIO(new_data), header=None, index_col=0)  # Update DataFrame with edited text
        except Exception as e:
            messagebox.showerror("Error", f"Invalid data format: {e}")
            return

        if self.file_path:
            try:
                with open(self.file_path, 'wb') as file:
                    pickle.dump(self.data, file)
                messagebox.showinfo("Success", "Changes saved successfully.")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save pickle file: {e}")
        else:
            messagebox.showerror("Error", "No file path available.")

def main():
    root = tk.Tk()
    app = PickleEditorApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
