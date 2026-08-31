#
# ffb.py
#
# manage Firefox bookmarks with GUI On Linux
#
# Aided with basic GitHub coding tools
# 
import os
import configparser
import sqlite3
import tkinter as tk
from tkinter import messagebox, simpledialog
import tkinter.scrolledtext as tkscrolled

# Define the path to Firefox's bookmarks database
home = os.environ['HOME']
installsdotini= home + "/" + ".mozilla/firefox/installs.ini"

install_config = configparser.ConfigParser()
install_config.read(installsdotini)
sections =  install_config.sections()
default_directory = install_config[sections[0]]['DEFAULT']
print(f"default_directory: {default_directory}")

# FIREFOX_DB = r"C:\Users\YourUsername\AppData\Roaming\Mozilla\Firefox\Profiles\YourProfile\places.sqlite"
FIREFOX_DB = home  + "/.mozilla/firefox/" + default_directory + "/places.sqlite"


class BookmarkManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Firefox Bookmark Manager")

        # Buttons
        tk.Button(root, text="Retrieve Bookmarks", command=self.retrieve_bookmarks).pack()
        tk.Button(root, text="Add Bookmark", command=self.add_bookmark).pack()
        tk.Button(root, text="Delete Bookmark", command=self.delete_bookmark).pack()
        #self.output = tk.Text(root, height=40, width=80)
        self.output = tkscrolled.ScrolledText(root, height=40, width=80)
        self.output.pack()

    def execute_query(self, query, params=()):
        with sqlite3.connect(FIREFOX_DB) as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.fetchall()

    def retrieve_bookmarks(self):
        query = "SELECT moz_places.title, url FROM moz_bookmarks INNER JOIN moz_places ON moz_bookmarks.fk=moz_places.id"
        bookmarks = self.execute_query(query)
        
        self.output.delete(1.0, tk.END)
        for title, url in bookmarks:
            self.output.insert(tk.END, f"{title}: {url}\n")

    def add_bookmark(self):
        title = simpledialog.askstring("Add Bookmark", "Enter Title:")
        url = simpledialog.askstring("Add Bookmark", "Enter URL:")
        
        if title and url:
            query = "INSERT INTO moz_places(url) VALUES (?)"
            self.execute_query(query, (url,))
            place_id = self.execute_query("SELECT last_insert_rowid()")[0][0]
            self.execute_query("INSERT INTO moz_bookmarks(title, fk) VALUES (?, ?)", (title, place_id))
            messagebox.showinfo("Success", "Bookmark Added Successfully!")

    def delete_bookmark(self):
        title = simpledialog.askstring("Delete Bookmark", "Enter Bookmark Title:")
        if title:
            self.execute_query("DELETE FROM moz_bookmarks WHERE title=?", (title,))
            messagebox.showinfo("Success", "Bookmark Deleted Successfully!")

root = tk.Tk()
app = BookmarkManager(root)
root.mainloop()
