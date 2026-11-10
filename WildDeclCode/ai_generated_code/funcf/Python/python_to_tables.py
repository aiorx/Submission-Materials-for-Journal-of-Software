```python
def parse_table_with_regex(md_table: str) -> ColumnsValuesTableType:
    """
    Designed via basic programming aids 3.5 Turbo model.

    First element is headers, subsequent elements are rows.
    """
    rows = md_table.strip().split("\n")
    # Get the column names from the first row
    col_names = re.findall(r"\| *([^\|\n ]+) *", rows[0])
    num_cols = len(col_names)
    # Initialize the table data as a list of empty lists
    table_data: list[list[str]] = [[] for i in range(num_cols)]
    # Parse the remaining rows
    for row in rows[2:]:
        # Split the row into cells
        # cells = re.findall(r"\| *([^\|\n]+?) *", row)
        cells = [_.strip() for _ in row.strip().split("|")[1:-1]]
        # Check that the row has the correct number of cells
        if len(cells) != num_cols:
            raise ValueError(f"Row has {len(cells)} cells, but expected {num_cols}")
        # Add each cell to the appropriate column in the table data
        for i, cell in enumerate(cells):
            table_data[i].append(cell)
    # Combine the column names with the table data and return the result
    return [col_names] + list(zip(*table_data, strict=True))
```