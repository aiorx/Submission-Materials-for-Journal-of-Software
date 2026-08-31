# Supported via standard programming aids
# MODIFIED

import random

def generate_operations(num_operations=10, file_name="operations.txt"):
    operations = []
    inserted_points = []  # This will store the points that are inserted
    
    for _ in range(num_operations):
        op_type = random.choice([0, 1, 2])  # Randomly choose 0 (search), 1 (insert), or 2 (delete)

        if op_type == 0:  # Search operation
            operations.append("0")  # Search operation is just 0

        elif op_type == 1:  # Insert operation
            # Generate random coordinates (x1, y1) and (x2, y2) such that x1 < x2 and y1 < y2
            x1 = random.randint(0, 50)
            y1 = random.randint(0, 50)
            x2 = random.randint(x1 + 1, 100)  # Ensure x2 > x1
            y2 = random.randint(y1 + 1, 100)  # Ensure y2 > y1
            insert_operation = f"1 {x1} {y1} {x2} {y2}"
            operations.append(insert_operation)
            inserted_points.append((x1, y1, x2, y2))  # Store the inserted points for potential deletion

        elif op_type == 2 and inserted_points:  # Delete operation (only if there are inserted points)
            # Randomly choose an inserted point to delete
            x1, y1, x2, y2 = random.choice(inserted_points)
            delete_operation = f"2 {x1} {y1} {x2} {y2}"
            operations.append(delete_operation)
            inserted_points.remove((x1, y1, x2, y2))  # Remove the deleted point from the list

    # Write the operations to the text file
    with open(file_name, "w") as f:
        for operation in operations:
            f.write(f"{operation}\n")

    print(f"Generated {num_operations} operations and saved to '{file_name}'")

if __name__ == "__main__":
    generate_operations(30)  # Generate 10 operations by default
