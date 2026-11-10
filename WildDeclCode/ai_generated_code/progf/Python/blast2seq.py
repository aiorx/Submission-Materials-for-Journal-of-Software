# GUI for blast2sequences; Crafted with standard coding tools 20230914, 20240709 and 20240801
import tkinter as tk
from tkinter import filedialog, messagebox
import subprocess
import os
import tempfile

def run_blastn():
    query_text = query_textbox.get("1.0", "end-1c")
    subject_text = subject_textbox.get("1.0", "end-1c")

    if query_file_path.get():
        query_file = query_file_path.get()
    else:
        query_file = tempfile.mktemp(suffix=".fasta")
        with open(query_file, "w") as file:
            file.write(query_text)

    if subject_file_path.get():
        subject_file = subject_file_path.get()
    else:
        subject_file = tempfile.mktemp(suffix=".fasta")
        with open(subject_file, "w") as file:
            file.write(subject_text)

    command = ["blastn", "-query", query_file, "-subject", subject_file, "-sorthits", "4"]

    if task_var.get() != "blastn":
        command.extend(["-task", task_var.get()])

    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        result_text.delete(1.0, tk.END)
        result_text.insert(tk.END, result.stdout)
    except subprocess.CalledProcessError as e:
        result_text.delete(1.0, tk.END)
        result_text.insert(tk.END, f"Error: {e.stderr}")
    finally:
        if not query_file_path.get() and os.path.exists(query_file):
            os.remove(query_file)
        if not subject_file_path.get() and os.path.exists(subject_file):
            os.remove(subject_file)

def browse_file(entry_widget):
    file_path = filedialog.askopenfilename()
    if file_path:
        entry_widget.delete(0, tk.END)
        entry_widget.insert(0, file_path)

app = tk.Tk()
app.title("BLASTN GUI")

# Query sequence section
query_label = tk.Label(app, text="Paste Query Sequence:")
query_label.pack(padx=5, pady=5)

query_textbox = tk.Text(app, wrap=tk.WORD, width=120, height=5)
query_textbox.pack(padx=5, pady=5)

query_file_path = tk.StringVar()
query_file_entry = tk.Entry(app, textvariable=query_file_path, width=120)
query_file_entry.pack(padx=5, pady=5)

query_browse_button = tk.Button(app, text="Or Browse Query File", command=lambda: browse_file(query_file_entry))
query_browse_button.pack(padx=5, pady=5)

# Subject sequence section
subject_label = tk.Label(app, text="Paste Subject Sequence:")
subject_label.pack(padx=5, pady=5)

subject_textbox = tk.Text(app, wrap=tk.WORD, width=120, height=5)
subject_textbox.pack(padx=5, pady=5)

subject_file_path = tk.StringVar()
subject_file_entry = tk.Entry(app, textvariable=subject_file_path, width=120)
subject_file_entry.pack(padx=5, pady=5)

subject_browse_button = tk.Button(app, text="Or Browse Subject File", command=lambda: browse_file(subject_file_entry))
subject_browse_button.pack(padx=5, pady=5)

# Dropdown menu for the -task option
task_label = tk.Label(app, text="Select BLASTN Task:")
task_label.pack(padx=5, pady=5)

task_options = ["blastn", "blastn-short", "dc-megablast", "megablast", "rmblastn"]
task_var = tk.StringVar(value=task_options[0])  # Default to "blastn"
task_menu = tk.OptionMenu(app, task_var, *task_options)
task_menu.pack(padx=5, pady=5)

# Run button and result display
run_button = tk.Button(app, text="Run BLASTN", command=run_blastn)
run_button.pack(padx=5, pady=5)

result_label = tk.Label(app, text="BLASTN Results:")
result_label.pack(padx=5, pady=5)

scrollbar = tk.Scrollbar(app)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

result_text = tk.Text(app, wrap=tk.WORD, width=120, height=60, yscrollcommand=scrollbar.set)
result_text.pack(padx=5, pady=5)

scrollbar.config(command=result_text.yview)

app.mainloop()
