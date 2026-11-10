import csv
"""
Drafted using common development resources as a way to view csv data
in format from the terminal window. 
"""

def display_csv(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        rows = list(reader)

        # Get the width of each column based on the longest item in each column
        column_widths = [max(len(str(item)) for item in col) for col in zip(*rows)]

        # Function to format values (2 decimal places for numeric values)
        def format_value(value):
            try:
                # Try to convert to float and format to 2 decimal places
                return f'{float(value):.2f}'
            except ValueError:
                # If conversion fails, return the value as is (for non-numeric values)
                return value

        # Print the header row with proper formatting
        header = rows[0]
        print(' | '.join(f'{header[i]:<{column_widths[i]}}' for i in range(len(header))))
        print('-+-'.join('-' * column_widths[i] for i in range(len(header))))

        # Print the rest of the rows with formatted values
        for row in rows[1:]:
            formatted_row = [format_value(row[i]) for i in range(len(row))]
            print(' | '.join(f'{formatted_row[i]:<{column_widths[i]}}' for i in range(len(formatted_row))))


file_path = 'flight1.csv'  
display_csv(file_path)

