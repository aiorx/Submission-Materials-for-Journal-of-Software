#import pandas as pd

#Question 1
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    else:
        fib = [0, 1]
        for i in range(2, n):
            fib.append(fib[i-1] + fib[i-2])
        return fib
    
    #/explain
    # The provided Python code defines a function named fibonacci that generates a list of Fibonacci numbers up to the nth term.
    # The Fibonacci sequence is a series of numbers in which each number is the sum of the two preceding ones, usually starting with 0 and 1.
    # The function takes one argument n, which is the number of terms in the Fibonacci sequence that the function will generate.
    # The function begins by checking if n is less than or equal to 0. If it is, the function returns an empty list, as a Fibonacci sequence of zero or negative length doesn't make sense.
    # Next, the function checks if n is 1. If it is, the function returns a list containing only the number 0, which is the first number in the Fibonacci sequence.
    # The function then checks if n is 2. If it is, the function returns a list containing the first two numbers of the Fibonacci sequence, 0 and 1.
    # If n is greater than 2, the function creates a list fib initialized with the first two numbers of the Fibonacci sequence.
    # It then enters a loop that starts from 2 and ends at n (exclusive). For each iteration of the loop, the function appends the sum of the last two numbers in the fib list to the end of the list. This is the key step that generates each new number in the Fibonacci sequence.
    # Finally, the function returns the fib list, which now contains the first n numbers of the Fibonacci sequence.

#Question 2

#git init
#git add .
#git commit -m "commit"
#git push -u origin main

#Question 3
def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

primes = []
for i in range(1, 101):
    if is_prime(i):
        primes.append(i)

print(primes)

#Refactored code from github copilot
def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

primes = [i for i in range(2, 101) if is_prime(i)]

print(primes)

#Question 4
# mkdir data_analysis
# cd data_analysis
# touch analysis.py
# echo '#!/usr/bin/env python' > analysis.py


#Question 5
#Python function to calculate a factorial, but range should be range(1,n+1) not range(1,n-1)
n = 10
fact = 1

for i in range(1, n+1):
    fact = fact * i

print("The factorial of 23 is : ", end="")
print(fact)

# /fix command gives

#To fix the code, I would update the range in the for loop to range(1, n+1) to correctly calculate the factorial.

n = 10
fact = 1

for i in range(1, n+1):
    fact = fact * i

print("The factorial of 23 is : ", end="")
print(fact)


#Question 7
def normalize_data(data):
    min_val = min(data)
    max_val = max(data)
    return [(x - min_val) / (max_val - min_val) for x in data]

#/explain gives
#The provided Python code defines a function named normalize_data that normalizes a list of numerical data. 
#Normalization is a scaling technique used in data preprocessing where values are shifted and rescaled so that they end up ranging between 0 and 1. It is useful in some machine learning algorithms when your data has varying scales and the algorithm you are using does not make assumptions about the distribution of your data, such as k-nearest neighbors and artificial neural networks.
#The function takes one argument data, which is expected to be a list of numerical values.
#Inside the function, it first calculates the minimum value min_val in the data list using the built-in min function. Then it calculates the maximum value max_val in the data list using the built-in max function.
#The function then returns a new list that is created by a list comprehension. The list comprehension iterates over each value x in the data list. For each x, it calculates the normalized value as (x - min_val) / (max_val - min_val). This is the formula for min-max normalization, which scales the data to a fixed range - usually 0 to 1.
#The result is a new list where all the values have been normalized to fall between 0 and 1, inclusive. If the data list is empty, the function will return an empty list.

#Question 8
#R code translated to python
# Create a sample dataframe with missing values
df = pd.DataFrame({
    'A': [1, 2, None, 4, 5],
    'B': [None, 2, 3, 4, 5],
    'C': [1, 2, 3, None, 5],
    'D': [1, 2, 3, 4, 5]
})

# Define the function
def count_missing_values(df):
    return df.isnull().sum()

# Test the function
result = count_missing_values(df)
print(result)

#Question 9
#Python
def count_vowels(string):
    vowels = ['a', 'e', 'i', 'o', 'u']
    count = 0
    for char in string:
        if char.lower() in vowels:
            count += 1
    return count

#R code is in R file

#Question 10
# The provided binary string translates to "You've completed the assignment. Congratulations!" in text.