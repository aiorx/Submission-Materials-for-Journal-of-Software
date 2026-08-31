#these was Produced with third-party coding tools
def generate_pascals_triangle(n):
    triangle = []  # Create an empty list to store Pascal's Triangle
    for i in range(n):  # Loop through each row number from 0 to n-1
        row = [1] * (i + 1)  # Create a new row with i+1 elements, all set to 1
        for j in range(1, i):  # Loop through elements in the row (excluding the first and last)
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j]  # Calculate the value based on the previous row
        triangle.append(row)  # Add the completed row to Pascal's Triangle
    return triangle  # Return the generated Pascal's Triangle


def print_pascals_triangle(triangle):
    for row in triangle:  # Loop through each row in Pascal's Triangle
        row_str = " ".join(str(num) for num in row)  # Convert each number in the row to a string and join them with spaces
        print(row_str.center(len(triangle[-1]) * 3))  # Center the row's string within a space of width len(triangle[-1]) * 3


if __name__ == "__main__":
    try:
        rows = int(input("Enter the number of rows for Pascal's Triangle: "))  # Ask the user for the number of rows
        if rows <= 0:
            raise ValueError("Number of rows must be a positive integer.")  # Raise an error for non-positive input
        
        pascals_triangle = generate_pascals_triangle(rows)  # Generate Pascal's Triangle with the specified number of rows
        print("\nPascal's Triangle:")
        print_pascals_triangle(pascals_triangle)  # Print the generated Pascal's Triangle

    except ValueError as e:
        print(f"Error: {e}")  # Handle the case where the user enters a non-integer and print an error message
