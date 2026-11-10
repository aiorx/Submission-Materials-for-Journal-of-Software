"""
The following code was mostly Drafted using common development resources 3.5 in January 2024, from a few back and
forth chats and a little bit of manual intervention.
Noting this to give a sense of how useful code generation is at the moment, and more for
posterity, once this damn robot steals my job in the future!
This script can be ran against the review.json export from goodreads, and currently
filters for book reviews made in 2023, sorts them in date ASC, and then prints out in an
opinionated markdown.
"""

import json

json_file_path = "review.json"

# Function to extract and print book details
def extract_book_details(book_data):
    title = book_data.get("book", "(no title)")
    rating = book_data.get("rating", "(no rating)")
    review = book_data.get("review", "(no review)")

    print("
### {}

{}/5 :star:

{}
".format(title, rating, review))

try:
    # Open the JSON file and read its contents
    with open(json_file_path, "r") as json_file:
        # Load JSON data from the file
        json_data = json.load(json_file)

        # Sort the JSON data by date in ascending order
        sorted_json_data = sorted(
            json_data,
            key=lambda x: (
                x.get("read_at") or "9999-12-31",
                x.get("updated_at") or "9999-12-31",
            ),
        )

        # Iterate through each entry in the JSON data
        for entry in sorted_json_data:
            # Check if the entry contains book details
            if "book" in entry and "rating" in entry and "review" in entry:
                read_at = entry.get("read_at")
                if read_at and read_at.startswith("2023"):
                    extract_book_details(entry)

except FileNotFoundError:
    print("Error: File '{}' not found.".format(json_file_path))
except json.JSONDecodeError:
    print("Error: Invalid JSON format in '{}'.".format(json_file_path))
except Exception as e:
    print("An error occurred: {}".format(e))
