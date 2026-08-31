#
# crud.py
#
# Aided with basic GitHub coding tools
#
import sqlite3
import tkinter as tk
from tkinter import ttk, messagebox

# Database setup
conn = sqlite3.connect("/tmp/database.db")
cursor = conn.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, comment TEXT)")
conn.commit()

# GUI setup
root = tk.Tk()
root.title("SQLite CRUD with Tkinter")

# Treeview
tree = ttk.Treeview(root, columns=("ID", "Comment"), show="headings")
tree.heading("ID", text="ID")
tree.heading("Comment", text="Comment")
tree.pack(fill=tk.BOTH, expand=True)

# Entry fields
comment_var = tk.StringVar()
entry = tk.Entry(root, textvariable=comment_var)
entry.pack()

# CRUD functions
def refresh():
    tree.delete(*tree.get_children())
    cursor.execute("SELECT * FROM test")
    for row in cursor.fetchall():
        tree.insert("", "end", values=row)

def add():
    comment = comment_var.get()
    cursor.execute("INSERT INTO test (comment) VALUES (?)", (comment,))
    conn.commit()
    refresh()

def update():
    selected_item = tree.selection()
    if not selected_item:
        messagebox.showwarning("Warning", "Select an item to update")
        return
    item = tree.item(selected_item[0])["values"]
    cursor.execute("UPDATE test SET comment=? WHERE id=?", (comment_var.get(), item[0]))
    conn.commit()
    refresh()

def delete():
    selected_item = tree.selection()
    if not selected_item:
        messagebox.showwarning("Warning", "Select an item to delete")
        return
    item = tree.item(selected_item[0])["values"]
    cursor.execute("DELETE FROM test WHERE id=?", (item[0],))
    conn.commit()
    refresh()

# Buttons
btn_add = tk.Button(root, text="Add", command=add)
btn_add.pack()
btn_update = tk.Button(root, text="Update", command=update)
btn_update.pack()
btn_delete = tk.Button(root, text="Delete", command=delete)
btn_delete.pack()
btn_refresh = tk.Button(root, text="Refresh", command=refresh)
btn_refresh.pack()

refresh()
root.mainloop()
