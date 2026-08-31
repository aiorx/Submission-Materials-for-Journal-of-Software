# This program was Drafted using common development resources. 
import json

def load_modify_and_save_json(file_path, new_size=35, output_file='output.2.3.json'):
    try:
        # Load JSON data from file
        with open(file_path, 'r') as file:
            data = json.load(file)

        # Modify the 'size' field in every record to the new_size
        for record in data:
            record['size'] = new_size

        # Save the modified data back to a new JSON file in reverse order
        with open(output_file, 'w') as output_file:
            json.dump(data[::-1], output_file, indent=2)

        print(f"Successfully loaded, modified, and saved reversed JSON data to {output_file}")
    except FileNotFoundError:
        print(f"Error: File not found - {file_path}")
    except json.JSONDecodeError:
        print(f"Error: Unable to decode JSON in file - {file_path}")
    except Exception as e:
        print(f"Error: {e}")

# Example usage:
file_path = 'large-file.json'  # Replace with the path to your JSON file
load_modify_and_save_json(file_path)
