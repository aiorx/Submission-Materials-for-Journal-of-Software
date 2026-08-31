# Created as a part of the BAIL repository on Github. Created 01/19/2024

# Designed via basic programming aids...
# A simple beginner project involving for loops could be to create a program that prints the multiplication table for a given number.
# The program can take an input from the user for the number and then use a for loop to calculate and print the multiplication table
# for that number. This project will help in understanding the use of for loops for repetitive tasks and basic user input/output.

# Get user input for a number
user_input = input("Enter a number: ")
print(user_input)

# The upper range of this for loop will not be accessible.
# I would have to use len(item to loop through) + 1. This is why the upper range is 11
for i in range(1, 11):
    print(user_input, "x", i, "=", int(user_input) * i)
