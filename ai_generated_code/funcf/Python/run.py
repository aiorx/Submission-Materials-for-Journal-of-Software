```python
def get_report():
    """
    Function to get a report on recent expenses that have been logged
    Function Composed with basic coding tools
    """
    global current_user_id
    console = Console()
    print("\n  Fetching data...\n")
    sleep(1.5)
    try:
        records = Expenses.get_all_records()
        rows = [row for row in records if str(row["user_id"])
                == str(current_user_id)]

        if not rows:
            print("  You have logged no expenses so far. Let's get started!")
            return expense_menu()

        df = pd.DataFrame(rows, columns=["user_id", "amount", "category",
                          "date"])
        df["amount"] = df["amount"].astype(float)
        df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")

        # Extract month and year from the date
        df["month_year"] = df["date"].dt.to_period("M")
        # Group by month and category
        grouped = (
            df.groupby(["month_year", "category"]).agg({"amount": "sum"})
            .reset_index()
        )
        # Sort the grouped data
        grouped = grouped.sort_values(by=["month_year", "category"])

        table = Table(title="Recent Expenses (Grouped by Month and Category)")
        table.add_column("Month-Year", justify="right", style="cyan",
                         no_wrap=True)
        table.add_column("Category", style="magenta")
        table.add_column("Amount", justify="right", style="green")

        for _, row in grouped.iterrows():
            table.add_row(str(row["month_year"]), row["category"],
                          f'{row["amount"]:.2f}')

        console.print(table)
        return expense_menu()
    except Exception as e:
        print(f"  An error occurred: {e}")
```

```python
def display_expenses():
    """
    Helper function to list all expenses for the current user
    Composed with basic coding tools
    """
    global current_user_id
    console = Console()
    try:
        records = Expenses.get_all_records()
        rows = [row for row in records if str(row['user_id']) ==
                str(current_user_id)]

        if not rows:
            print("  No expenses found")
            return expense_menu()

        df = pd.DataFrame(rows, columns=['user_id', 'amount', 'category',
                                         'date'])
        df['amount'] = df['amount'].astype(float)
        df['date'] = pd.to_datetime(df['date'],
                                    format='%d-%m-%Y').dt.strftime('%d-%m-%Y')

        # Adjust index to start from 1 instead of 0
        df.index += 1

        table = Table(title="Your Expenses:")

        table.add_column("Index", justify="right", style="cyan", no_wrap=True)
        table.add_column("Amount", justify="right", style="green")
        table.add_column("Category", style="magenta")
        table.add_column("Date", justify="right", style="cyan")

        for index, row in df.iterrows():
            table.add_row(str(index), f'{row["amount"]:.2f}',
                          row["category"], row["date"])

        console.print(table)
        return df
    except Exception as e:
        print(f'  An error occurred: {e}')
        return None
```