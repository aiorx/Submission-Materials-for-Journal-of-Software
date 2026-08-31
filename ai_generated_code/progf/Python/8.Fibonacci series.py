#Fibonacci Sequence: Generate a Fibonacci sequence up to a certain number.
# 1, 2, 3, 5, 8, 13, ....
# 0, 1, 1, 2, 3, 5,

Till = 50  

# AMA = Automated answer
# fib = [0, 1]
# for i in range(2, Till):
#     fib.append(fib[i-1] + fib[i-2])

# failure 1
# Storage = 0    
#     Storage = (Storage + i)
#     print(Storage)

# successfully created using my brain but as per gpt this is not good and efficient
Starty = 1
Storage = 0
print(Storage)
while Starty < Till:
    Storage = Storage + Starty
    if Storage > Till:
        break
    print(Storage)
    Starty = Storage - Starty


#Modified by Gdp

# Set the maximum limit for the Fibonacci sequence
limit = 50  # You can change this to any number you want

# Initialize the first two Fibonacci numbers
a, b = 0, 1

# Print the initial number in the sequence
print(a)

# Generate the Fibonacci sequence
while b <= limit:
    print(b)
    a, b = b, a + b  # Update a and b to the next numbers in the sequence


#Designed with routine coding tools

def fibonacci_sequence(limit):
    # Starting values for the Fibonacci sequence
    fib_sequence = [0, 1]
    
    # Generate Fibonacci numbers up to the given limit
    while fib_sequence[-1] + fib_sequence[-2] <= limit:
        fib_sequence.append(fib_sequence[-1] + fib_sequence[-2])
    
    return fib_sequence

# Example usage
limit = 100  # Define the limit up to which the Fibonacci sequence should be generated
fib_sequence = fibonacci_sequence(limit)
print(fib_sequence)


