# Supported via basic programming aids and prompts by ReindeerFlotilla
# Script to parse a JSON file created by LibreChat as found in the optional MongoDB database.

import json
import argparse
from datetime import datetime
from zoneinfo import ZoneInfo

# Setup argument parser
parser = argparse.ArgumentParser(
    description="Parse JSON file and optionally output in Markdown format. Includes an option to only show unknown users."
)

# Input JSON file path
parser.add_argument("input_file", type=str, help="Input JSON file path")

# Option to output in Markdown format
parser.add_argument(
    "-md", "--markdown", action="store_true", help="Output in Markdown format"
)

# Option to specify an output file name, without the extension
parser.add_argument(
    "-o", "--output", type=str, help="Output file name (without extension)"
)

# If the unknown option is enabled, only include messages from unknown users, defined as users not in the user_aliases dictionary. Useless if user_aliases is commented out and empty.
# parser.add_argument(
#    "-unk",
#    "--unknown",
#    action="store_true",
#    help="Include only messages from unknown users",
# )

# If the user option is enabled, only include messages from the specified user
# parser.add_argument("-u", "--user", type=str, help="Filter messages by a specific user")

# Parse command-line arguments
args = parser.parse_args()

# Define a dictionary mapping user IDs to aliases, including the new ID for Patrick
# user_aliases = {
#     "xxxxxxxxxxxxxx": "xxxxxxxx",
#     "xxxxxxxxxxxxxx": "xxxxxxxx",
#     "xxxxxxxxxxxxxx": "xxxxxxxx",  # New user ID also mapped to xxxxxxxx
# }

# If a user filter is provided, convert it to match the aliases used in the script
# user_filter = None
# if args.user:
#     if args.user.lower() == "xxxxxxxxx":
#         user_filter = "xxxxxxxxx"
#     elif args.user.lower() == "xxxxxxxxx":
#         user_filter = "xxxxxxxxx"

# Determine the file extension based on the markdown flag
file_extension = "md" if args.markdown else "txt"
output_file = f"{args.output}.{file_extension}" if args.output else None


# Function to output data
def output_data(data_str, output_file):
    if output_file:
        with open(output_file, "a", encoding="utf-8") as f:
            f.write(data_str + "\n")
    else:
        print(data_str)


with open(args.input_file, "r", encoding="utf-8") as file:
    for line in file:
        # Each line is a separate JSON object
        data = json.loads(line)

        # Extract the desired information
        sender = data.get("sender")
        text = data.get("text")
        token_count = data.get("tokenCount")
        model = data.get("model")
        user = data.get("user")

        # Format the updatedAt field
        # updated_at = data.get('updatedAt', {}).get('$date')
        # if updated_at:
        #     updated_at = datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%Y-%m-%d %H:%M:%S")

        updated_at = data.get("updatedAt", {}).get("$date")
        if updated_at:
            utc_time = datetime.strptime(updated_at, "%Y-%m-%dT%H:%M:%S.%fZ").replace(
                tzinfo=ZoneInfo("UTC")
            )

            # Convert the time to Eastern Time because I live in EST/EDT
            eastern_time = utc_time.astimezone(
                ZoneInfo("America/Detroit")
            )  # Automatically handles DST
            updated_at = eastern_time.strftime("%Y-%m-%d %H:%M:%S")

        # Replace the user ID with its alias if it exists in the dictionary
        # user_alias = user_aliases.get(user, user)

        # Check if the current message's user matches the specified user filter
        # if user_filter and user_alias != user_filter:
        #     continue  # Skip this message if it's not from the specified user

        # Skip known users if the unknown option is enabled
        # if args.unknown and user_alias in user_aliases.values():
        #     continue

        if args.markdown:
            # Format output as Markdown with explicit line breaks
            output_str = f"**Sender:** {sender}  \n**User:** {user}  \n**Model:** {model}  \n**Token Count:** {token_count}  \n**Updated At:** {updated_at}  \n**Text:**\n\n{text}\n\n---\n"
        else:
            # Format output as plain text
            output_str = f"Sender: {sender}\nUser: {user}\nModel: {model}\nToken Count: {token_count}\nUpdated At: {updated_at}\nText:\n{text}\n\n-----\n"

        # Output the data
        output_data(output_str, output_file)
