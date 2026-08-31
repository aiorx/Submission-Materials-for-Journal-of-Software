```python
def create_monthly_content(self) -> QWidget:    # the current version is just a placeholder, Supported via standard GitHub programming aids
                                                # method is not yet implemented
    """
    create monthly overview content area
    """
    
    # create monthly content area
    monthly_content = QWidget()
    monthly_content.setStyleSheet("background-color: white;")
    monthly_layout = QGridLayout()
    monthly_layout.setContentsMargins(10, 10, 10, 10)
    monthly_layout.setSpacing(10)
    monthly_content.setLayout(monthly_layout)

    # get expenses and calculate totals by category for selected month
    expenses = db.get_expenses()
    current_month = datetime.date.today().strftime("%Y-%m")
    category_totals = {}
    for expense in expenses:
        if str(expense.date).startswith(current_month):
            category_totals[expense.category] = category_totals.get(expense.category, 0) + expense.amount

    # create pie chart
    fig = Figure(figsize=(5, 5))
    ax = fig.add_subplot(111)
    if category_totals:
        # append percentage ans total amount to labels
        values = list(category_totals.values())
        keys = list(category_totals.keys())
        total = sum(values)
        labels = [
            f"{key} {value / total * 100:.1f}%, {value:.2f}€"
            for key, value in zip(keys, values)
        ]
        # create pie chart with values and labels
        ax.pie(
            values,
            labels = labels,
            startangle = 90,
            wedgeprops = dict(width=0.3, edgecolor='w')
        )
        ax.set_title("Expenses by Category")
    else:
        ax.text(0.5, 0.5, "No data for this month", ha='center', va='center')

    # create canvas for the pie chart
    canvas = FigureCanvas(fig)
    monthly_layout.addWidget(canvas, 0, 0, 1, 1)

    return monthly_content
```