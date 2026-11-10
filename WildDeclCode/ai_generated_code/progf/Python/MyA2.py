# Allow users to interactively explore and analyze sales data from a CSV file by
# providing a simple command-line interface.
import pandas as pd
import pyarrow  
import ssl
import time
import sys

ssl._create_default_https_context = ssl._create_unverified_context

# Set the display to show all columns
#pd.set_option("display.max_columns", None)
pd.set_option("display.max_rows", None)


# Import the data file.  This needs to be downloaded to be used by Pandas.  
# It is in CSV format.
def load_csv(file_path):
    # Attempt to read the CSV file  
    try:
        print(f"Reading CSV file: {file_path}")
        start_time = time.time()
        sales_data = pd.read_csv(file_path, dtype_backend='pyarrow', on_bad_lines="skip")
        load_time = time.time() - start_time  
        print(f"File loaded in {load_time:.2f} seconds")
        print(f"Number of rows: {len(sales_data)}")
        #print(f"Columns: {sales_data.columns.to_list()}")

        # List the required columns
        required_columns = ['quantity', 'order_date', 'unit_price']

        # Check for missing columns
        missing_columns = [col for col in required_columns if col not in sales_data.columns]

        if missing_columns:
            print(f"\nWarning: The following required columns are missing: {missing_columns} ")
        else:
            print(f"\nAll required columns are present")

        # Ask Pandas to parse the order_date field into a standard representation
        sales_data['order_date'] = pd.to_datetime(sales_data['order_date'], format="mixed")

        # Save the first 10 rows of the data in sales_data_test.csv
        sales_data.head(10).to_csv('sales_data_test.csv')

        return sales_data

    except FileNotFoundError:
        print(f"Error: the file {file_path} was not found.")
    except pd.errors.EmptyDataError as e:
        print(f"Error: the file {file_path} was empty.")
    except pd.errors.ParserError as e:
        print(f"Error: there was a problem parsing {file_path}.")
    except Exception as e:
        print(f"An unexpected error has occurred: {e}")

# Function to display a user-choosable number of rows
def display_rows(data):
    data = select_rows_for_analysis(data)
    while True:
        numRows = len(data) - 1
        print("\nEnter number of rows to display:")
        print(f"- Enter a number between 1 and {numRows}")
        print("- To see all rows enter 'all'")
        print("- To skip, press Enter")
        user_choice = input("Your choice: ").strip().lower()

        if user_choice == '':
            print("Skipping preview")
            break
        elif user_choice == 'all':
            print(data)
            export_to_excel(data)  # Offer to export the entire DataFrame
            break
        elif user_choice.isdigit() and 1 <= int(user_choice) <= numRows:
            selected_data = data.head(int(user_choice))
            print(selected_data)
            export_to_excel(selected_data)  # Offer to export only the displayed rows
            break
        else:
            print("Invalid input. Please re-enter.")

# Cleanly exit the program
def exit_program(data):
    sys.exit(0)

# Display the top-level menu of user options
def display_menu(data):
    menu_options = (
        ("Show the first n rows of data", display_rows),
        ("Show total sales by region and order type", total_sales_by_region_and_order_type),
        ("Show average sales by region, state, and sale type", average_sales_by_region_state_and_type),
        ("Show sales by customer type and order type by state", sales_by_customer_type_and_order_type),
        ("Show total sales quantity and price by region and product", total_sales_quantity_and_price_by_region_and_product),
        ("Show total sales quantity and price by customer type", total_sales_quantity_and_price_by_customer_type),
        ("Show max and min sales price by category", max_min_sales_price_by_category),
        ("Show the number of unique employees by region", employees_by_region ),
        ("Create a custom pivot table", create_custom_pivot_table),
        ("Exit the program", exit_program)
    )

    print("\nPlease choose from among these options:")
    for index, (description, _) in enumerate(menu_options):
        print(f"{index+1}: {description}")

    num_choices = len(menu_options)
    choice = int(input(f"Select an option between 1 and {num_choices}: "))

    if 1 <= choice <= num_choices:
        action = menu_options[choice-1][1]
        action(data)
    else:
        print("Invalid input. Please re-enter.")


# Print the number of unique employees per region
def employees_by_region(data):
    data = select_rows_for_analysis(data)
    pivot_table = pd.pivot_table(data, index="sales_region", values="employee_id",
                                 aggfunc=pd.Series.nunique)
    print("\nNumber of Employees by Region")
    pivot_table.columns = ['Number of Employees']  # Rename the column for readability
    print(pivot_table)
    export_to_excel(pivot_table)
    return pivot_table


# Function to calculate and display total sales by region and order type(this function was generated using ChatGPT with the 
#the prompt: how can I create a function that calculates total sales by region and order type?)

def total_sales_by_region_and_order_type(data):
    data = select_rows_for_analysis(data)
    # Calculate total sales by region and order type
    data['total_sales'] = data['quantity'] * data['unit_price']
    pivot_table = data.pivot_table(
        values='total_sales',
        index='sales_region',
        columns='order_type',
        aggfunc='sum',
        fill_value=0
    )

# Display the result
    print("\nTotal Sales by Region and Order Type")
    print(pivot_table)
    export_to_excel(pivot_table)
    return pivot_table


# Function to calculate and display average sales by region, state, and sale type 
def average_sales_by_region_state_and_type(data):
    data = select_rows_for_analysis(data)
    # Calculate total sales and then average sales
    data['total_sales'] = data['quantity'] * data['unit_price']
    pivot_table = data.pivot_table(
        values='total_sales',
        index=['sales_region', 'customer_state'],
        columns='order_type',
        aggfunc='mean',
        fill_value=0
    )

# Display the result
    print("\nAverage Sales by Region, State, and Sale Type")
    print(pivot_table)
    export_to_excel(pivot_table)
    return pivot_table


# Function to calculate and display sales by customer type, order type, and state
# Function was Aided using common development resources by asking: How can I create a function that calculates and displays sales by customer type, order type, and state
def sales_by_customer_type_and_order_type(data):
    data = select_rows_for_analysis(data)
    # Ensure quantity and unit_price are numeric to avoid errors
    data['quantity'] = pd.to_numeric(data['quantity'], errors='coerce').fillna(0)
    data['unit_price'] = pd.to_numeric(data['unit_price'], errors='coerce').fillna(0)
    
    # Calculate total sales as quantity * unit_price
    data['total_sales'] = data['quantity'] * data['unit_price']

    # Check if essential columns exist
    required_columns = ['customer_state', 'customer_type', 'order_type', 'total_sales']
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        print(f"Error: Missing columns {missing_columns} in data.")
        return None

    # Create a pivot table for total sales
    try:
        pivot_table = data.pivot_table(
            values='total_sales',
            index=['customer_state', 'customer_type'],
            columns= 'order_type',
            aggfunc='sum',
            fill_value=0
        )
        print("\nSales by Customer Type and Order Type by State")
        print(pivot_table)
        export_to_excel(pivot_table)
        return pivot_table
    except Exception as e:
        print(f"An error occurred while generating the pivot table: {e}")
        return None

# Function to calculate and display total quantity and total sales price by region and product
def total_sales_quantity_and_price_by_region_and_product(data):
    data = select_rows_for_analysis(data)
    # Ensure quantity and unit_price are numeric to avoid errors
    data['quantity'] = pd.to_numeric(data['quantity'], errors='coerce').fillna(0)
    data['unit_price'] = pd.to_numeric(data['unit_price'], errors='coerce').fillna(0)

    # Calculate total sales price as quantity * unit_price
    data['total_sales_price'] = data['quantity'] * data['unit_price']

    # Check if eesential columns exist
    required_columns = ['sales_region', 'produce_name', 'quantity', 'total_sales_price']
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        print(f"Error: Missing columns {missing_columns} in data.")
        return None

    # Create a pivot table for total quantity and total sales price
    try:
        pivot_table = data.pivot_table(
            values=['quantity', 'total_sales_price'],
            index=['sales_region', 'produce_name'],
            aggfunc='sum',
            fill_value=0
        )
        print("\nTotal Sales Quantity and Price by Region and Product")
        print(pivot_table)
        export_to_excel(pivot_table)
        return pivot_table
    except Exception as e:
        print(f"An error occurred while generating the pivot table: {e}")
        return None


# Function to calculate and display total quantity and total sales price by customer type
def total_sales_quantity_and_price_by_customer_type(data):
    data = select_rows_for_analysis(data)
    # Ensure quantity and unit_price are numeric to avoid errors
    data['quantity'] = pd.to_numeric(data['quantity'], errors='coerce').fillna(0)
    data['unit_price'] = pd.to_numeric(data['unit_price'], errors='coerce').fillna(0)

    # Calculate total sales price as quantity * unit_price
    data['total_sales_price'] = data['quantity'] * data['unit_price']

    # Check if essential columns exist
    required_columns = ['customer_type', 'quantity', 'total_sales_price']
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        print(f"Error: Missing columns {missing_columns} in data.")
        return None

    # Create a pivot table for total quantity and total sales price
    try:
        pivot_table = data.pivot_table(
            values=['quantity', 'total_sales_price'], 
            index='customer_type', 
            aggfunc='sum', 
            fill_value=0
        )
        print("\nTotal Sales Quantity and Price by Customer Type")
        print(pivot_table)
        export_to_excel(pivot_table)
        return pivot_table
    except Exception as e:
        print(f"An error occurred while generating the pivot table: {e}")
        return None



# Function to calculate and display max and min sales price by category
# This function was generated with ChatGPT by asking: How can I create a function that calculates the max and min of sales price by category
def max_min_sales_price_by_category(data):
    data = select_rows_for_analysis(data)
    # Ensure unit_price is numeric to avoid errors
    data['unit_price'] = pd.to_numeric(data['unit_price'], errors='coerce').fillna(0)

    # Check if the 'category' and 'unit_price' columns exist
    required_columns = ['product_category', 'unit_price']
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        print(f"Error: Missing columns {missing_columns} in data.")
        return None

    # Create a pivot table for max and min sales price by category
    try:
        pivot_table = data.pivot_table(
            values='unit_price', 
            index='product_category', 
            aggfunc={'unit_price': ['max', 'min']},
            fill_value=0
        )
# Rename columns for clarity
        pivot_table.columns = ['Max Sales Price', 'Min Sales Price']  
        print("\nMax and Min Sales Price by Category")
        print(pivot_table)
        export_to_excel(pivot_table)
        return pivot_table
    except Exception as e:
        print(f"An error occurred while generating the pivot table: {e}")
        return None


# This function is from ChatGPT I prompted it by asking: How can I create a funciton that prompts the user
#  for input to create a custom Pivot table
def create_custom_pivot_table(data):
    data = select_rows_for_analysis(data)
    # Define options for rows, columns, values, and aggregation functions
    row_options = {"1": "employee_name", "2": "sales_region", "3": "product_category"}
    column_options = {"1": "order_type", "2": "customer_type"}
    value_options = {"1": "quantity", "2": "sale_price"}
    aggfunc_options = {"1": "sum", "2": "mean", "3": "count"}

    # Helper function to prompt user for selection
    def get_user_selection(options, prompt):
        print(prompt)
        for key, value in options.items():
            print(f"{key}. {value}")
        choices = input("Enter the number(s) of your choice(s), separated by commas: ").split(",")
        return [options.get(choice.strip()) for choice in choices if choice.strip() in options]

    # User selects rows
    rows = get_user_selection(row_options, "\nSelect rows:")
    if not rows:
        print("No valid row selections made. Returning to main menu.")
        return

    # User selects columns (optional)
    columns = get_user_selection(column_options, "\nSelect columns (optional):")

    # User selects values
    values = get_user_selection(value_options, "\nSelect values:")
    if not values:
        print("No valid value selections made. Returning to main menu.")
        return

    # User selects a single aggregation function
    aggfunc_key = input("\nSelect aggregation function:\n1. sum\n2. mean\n3. count\nEnter your choice: ").strip()
    aggfunc = aggfunc_options.get(aggfunc_key)
    if not aggfunc:
        print("No valid aggregation function selected. Returning to main menu.")
        return

    # Debugging: Print user selections
    print(f"\nSelections:\nRows: {rows}\nColumns: {columns}\nValues: {values}\nAggregation Function: {aggfunc}")

    # Create the pivot table with the selected aggregation function
    try:
        pivot_table = data.pivot_table(
            index=rows,
            columns=columns if columns else None,
            values=values,
            aggfunc=aggfunc,
            fill_value=0
        )
        print("\nCustom Pivot Table:")
        print(pivot_table)
        export_to_excel(pivot_table)
        return pivot_table
    except Exception as e:
        print(f"An error occurred while creating the pivot table: {e}")



# Asks the user if they want their results exported to a excel file
def export_to_excel(pivot_table):
    export_choice = input("\nDo you want to export this pivot table to an Excel file? (yes/no): ").strip().lower()
    if export_choice == 'yes':
        filename = input("Enter the filename (without extension): ").strip()
        if not filename.endswith('.xlsx'):
            filename += '.xlsx'
        try:
            pivot_table.to_excel(filename)
            print(f"Pivot table successfully exported to {filename}")
        except Exception as e:
            print(f"An error occurred while exporting to Excel: {e}")
    else:
        print("Export skipped.")


# For each analytic, ask the user what data rows to use for the analytic (a range or a list of rows). 
# Use only this data for the analysis.
# This function was generated with ChatGPT asking: how can I create a function that For each analytic, asks
#  the user what data rows to use for the analytic (a range or a list of rows). 
# Use only this data for the analysis.
# Function to select rows by either range or specific indices
# Prompt the user to specify the rows to use for analysis
def select_rows_for_analysis(data):
    total_rows = len(data) - 1
    print(f"\nEnter the rows to use for this analysis:")
    print(f"- Enter a range (e.g., '1-10') or a list of rows separated by commas (e.g., '1,2,5,7')")
    print(f"- To use all rows, press Enter")

    row_choice = input("Your choice: ").strip()
    if not row_choice:
        print("Using all rows.")
        return data  # Use the entire dataset

    try:
        if '-' in row_choice:  # If the user specified a range
            start, end = map(int, row_choice.split('-'))
            if 0 <= start <= end <= total_rows:
                return data.iloc[start:end+1]
            else:
                print("Range is out of bounds. Using all rows.")
                return data
        else:  # If the user specified a list
            rows = [int(i) for i in row_choice.split(',')]
            return data.iloc[rows]
    except (ValueError, IndexError):
        print("Invalid input. Using all rows.")
        return data

# Call load_csv to load the file
url = "https://drive.google.com/uc?export=download&id=1Fv_vhoN4sTrUaozFPfzr0NCyHJLIeXEA"
#url = 'sales_data_test.csv'
sales_data = load_csv(url)

# Main loop for user interaction
def main():
    while True:
        display_menu(sales_data)

# If this is the main program, call main()
if __name__ == "__main__":
    main()
    