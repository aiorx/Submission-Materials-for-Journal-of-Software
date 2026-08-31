"""
calibre_readorder_sync_report.py

This script generates categorized lists of books in a Calibre library database based on the synchronization
status of the "readorder" tag and custom field. It helps identify and report discrepancies between the two.

Key Features:
1. Lists books with a "readorder" tag but no corresponding entry in the custom field.
2. Lists books with mismatched "readorder" tag and custom field values.
3. Lists books with a "readorder" custom field value but no "readorder" tag.

The script queries the following tables in the Calibre database:
- `books`: Stores book metadata.
- `books_tags_link`: Links books to their associated tags.
- `tags`: Stores all available tags.
- `custom_column_<id>`: Stores the custom field data for "readorder".

Requirements:
- A valid Calibre SQLite database file.
- The "readorder" custom field must exist in the Calibre library.

Usage:
- Place the script in the same directory as your Calibre metadata database (`metadata.db`).
- Run the script using Python: `python calibre_readorder_sync_report.py`.

Author: Toni Tassani
Creation Date: 23 Nov 2024
Note: This code was Assisted with basic coding tools.
"""

import sqlite3

# Path to the Calibre database
db_path = "/Users/toni.tassani/CalibreLibrary/metadata.db"

def generate_readorder_sync_report(db_path):
    """
    Generates a report categorizing books based on the synchronization status of the "readorder" tag
    and custom field.
    """
    # Connect to the Calibre database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Identify the internal column table name for the custom 'readorder' field
    cursor.execute("SELECT label, id FROM custom_columns WHERE label = 'readorder'")
    readorder_column = cursor.fetchone()
    
    if not readorder_column:
        print("Custom field 'readorder' not found in the Calibre database.")
        conn.close()
        return
    
    readorder_table_name = f"custom_column_{readorder_column[1]}"  # e.g., "custom_column_3"

    # Query to fetch books, their tags, and custom readorder values
    query = f"""
        SELECT 
            b.id,
            b.title,
            (SELECT GROUP_CONCAT(t.name, ', ') 
             FROM books_tags_link bt 
             JOIN tags t ON bt.tag = t.id 
             WHERE bt.book = b.id) AS tags,
            (SELECT value FROM {readorder_table_name} WHERE book = b.id) AS custom_readorder
        FROM books b
        GROUP BY b.id;
    """
    try:
        cursor.execute(query)
    except sqlite3.OperationalError as e:
        print(f"Error executing query: {e}")
        conn.close()
        return

    # Lists to store results
    readorder_tag_without_custom_field = []  # Case 1: Tag exists, but no custom field
    mismatched_readorder = []               # Case 2: Tag and custom field values differ
    custom_readorder_without_tag = []       # Case 3: Custom field exists, but no tag

    # Process each book and categorize
    for row in cursor.fetchall():
        book_id, title, tags, custom_readorder = row
        tags = tags or ""
        tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
        
        # Extract the "readorder" tag, if it exists
        readorder_tag_value = None
        for tag in tags_list:
            if tag.startswith("readorder:"):
                try:
                    readorder_tag_value = float(tag.split(":")[1])
                except ValueError:
                    pass  # Ignore malformed "readorder" tags

        # Case 1: Readorder tag exists but no custom field entry
        if custom_readorder is None and readorder_tag_value is not None:
            readorder_tag_without_custom_field.append((title, readorder_tag_value))

        # Case 2: Mismatched custom readorder and tag value
        elif custom_readorder is not None and readorder_tag_value is not None:
            try:
                custom_readorder_value = float(custom_readorder)
                if custom_readorder_value != readorder_tag_value:
                    mismatched_readorder.append((title, custom_readorder_value, readorder_tag_value))
            except ValueError:
                pass  # Ignore malformed custom field values

        # Case 3: Custom readorder exists but no tag
        elif custom_readorder is not None and readorder_tag_value is None:
            try:
                custom_readorder_value = float(custom_readorder)
                custom_readorder_without_tag.append((title, custom_readorder_value))
            except ValueError:
                pass  # Ignore malformed custom field values

    # Close the database connection
    conn.close()

    # Print results
    print("Books with readorder tag but no entry in readorder field:")
    for title, readorder_tag_value in readorder_tag_without_custom_field:
        print(f"- {title}: readorder tag value = {readorder_tag_value}")

    print("\nBooks with mismatched custom readorder and tag value:")
    for title, custom_readorder_value, readorder_tag_value in mismatched_readorder:
        print(f"- {title}: custom readorder = {custom_readorder_value}, readorder tag = {readorder_tag_value}")

    print("\nBooks with custom readorder but no readorder tag:")
    for title, custom_readorder in custom_readorder_without_tag:
        print(f"- {title}: custom readorder = {custom_readorder}")

# Run the report generation function
if __name__ == "__main__":
    generate_readorder_sync_report(db_path)

