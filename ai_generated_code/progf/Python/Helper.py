import pandas as pd
import tkinter as tk


def View_Score():
    df = pd.read_csv('Scorebook.csv')
    df = df.sort_values(by="Score", ascending=False)

    # Convert the top 10 rows to the specified format
    result = df.head(10).apply(lambda row: (row["Name"], row["Score"]), axis=1).tolist()
    return result,df

def show_table(data_to_display):
    root = tk.Tk()
    root.title("Top 10 highscores")

    # Create labels for the table headers
    header1 = tk.Label(root, text="Name", font=("Helvetica", 10, "bold"))
    header2 = tk.Label(root, text="Score", font=("Helvetica", 10, "bold"))

    header1.grid(row=0, column=0, padx=10, pady=5)
    header2.grid(row=0, column=1, padx=10, pady=5)

    # Sample data for the table
    data = data_to_display

    # Populate the table with data
    for i, (col1, col2) in enumerate(data, start=1):
        label_col1 = tk.Label(root, text=col1)
        label_col2 = tk.Label(root, text=col2)

        label_col1.grid(row=i, column=0, padx=10, pady=5)
        label_col2.grid(row=i, column=1, padx=10, pady=5)

    root.mainloop()


#"show table" was Produced via common programming aids