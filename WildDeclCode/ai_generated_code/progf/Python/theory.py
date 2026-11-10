"""
In Python, loops are essential constructs that allow you to execute a block of code repeatedly until a specific condition is met. Let’s explore the two primary types of loops in Python:

#-------------------------------------------------------------------
For Loop:
The for loop is used for sequential traversal. It allows you to iterate over elements in a list, string, array, or other data structures.
The syntax for a for loop is as follows:
Python

for variable in iterable_variable:
    # Code to execute

Here, variable represents the current element being processed, and iterable is the collection of elements.

Example:
Python

for fruit in ["apple", "banana", "cherry"]:
    print(fruit)
Routine programming code snippets. Review and use carefully. More info on FAQ.
Output:
apple
banana
cherry


#-------------------------------------------------------------------
While Loop:
The while loop executes a block of statements repeatedly until a given condition becomes false.
The syntax for a while loop is as follows:
Python

while expression:
    # Statements to execute

The loop continues as long as the expression remains true.

Example:
Python

count = 0
while count < 3:
    count += 1
    print("Hello Geek")
Routine programming code snippets. Review and use carefully. More info on FAQ.
Output:
Hello Geek
Hello Geek
Hello Geek


You can also use an else block with a while loop. The else block executes when the loop condition becomes false:
Python

count = 0
while count < 3:
    count += 1
    print("Hello Geek")
else:
    print("In Else Block")

Output:
Hello Geek
Hello Geek
Hello Geek
In Else Block

#-------------------------------------------------------------------
Infinite While Loop:
If you want a block of code to run indefinitely, you can create an infinite loop using the while loop.
Be cautious with this type of loop, as it can lead to an infinite execution:
Python

count = 0
while count == 0:
    print("Hello Geek")

Note: It’s recommended not to use infinite loops unless necessary, as you’ll need to forcefully terminate the program.

Remember, loops are powerful tools for controlling program flow and handling repetitive tasks in Python!
"""