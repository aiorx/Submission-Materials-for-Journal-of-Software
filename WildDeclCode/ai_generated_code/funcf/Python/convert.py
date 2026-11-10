```python
def convert_file(input_file):
    
    #read
    with open(input_file, 'r', encoding='utf-8') as file:
        data = file.readlines()

    #urgh regex - thanks chatgpt
    # for com.apps
    pattern = re.compile(r'time="([\d\-:\s]+)"\s+type=([A-Z_]+)\s+package=([a-zA-Z0-9\.]+)')  

    csv_data = [['Timestamp', 'Activity Type', 'Application']]

    # loop lines - append time and duration
    for line in data:
        match = pattern.search(line)
        if match:
            timestamp, activity_type, duration = match.groups()
            csv_data.append([timestamp, activity_type, duration])

    # user save location
    output_file = filedialog.asksaveasfilename(
        defaultextension=".csv",
        filetypes=[("CSV files", "*.csv")],
        title="Save As"
    )

    if not output_file:  # User canceled the save dialog thanks chatgpt omg
        return None

    # to CSV
    try:
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(csv_data)
        return output_file
    except Exception as e:
        messagebox.showerror("Error", f"Failed to save file: {e}")
        return None
```