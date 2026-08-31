
# Composed with basic coding tools modified by Mark  

def is_even(n):
    return n % 2 == 0



def is_prime(n):
    """Returns true if n is prime."""

    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# Function to find two prime numbers that sum up to the given even number
def goldbach_conjecture(n):
    for i in range(2, n):
        if is_prime(i) and is_prime(n - i):
            return i, n - i
    return None

# Main function
def main():
    # Get input from user
    num = int(input("Enter an even number greater than 2: "))

    if num <= 2 or not is_even(num):
        print("Please enter a valid even number greater than 2.")
        return
    
    result = goldbach_conjecture(num)
    if result:
        print(f"The two prime numbers that add up to {num} are {result[0]} and {result[1]}.")
    else:
        print("No valid prime pair found.")

# Run the program
if __name__ == "__main__":
    main()
