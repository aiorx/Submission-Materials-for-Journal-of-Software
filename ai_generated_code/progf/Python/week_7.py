"""
Week 7 exercises
https://docs.google.com/presentation/d/1j3Jeqf0DQWtO-iwmXOKg9xwQKqIX91YK37vlqNi19_0/edit?usp=sharing
edit and change the files however you wish!
"""

import doctest

def factorial(n):
    """
    n! n is non-negative.
    >>> factorial(0)
    1
    >>> factorial(1)
    1
    >>> factorial(4)
    24
    >>> factorial(100) == 100 * factorial(99)
    True
    >>> factorial(12)
    479001600
    """

    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

# Exercise define the increment function.
def increment(n):
    """
    The increment functions returns `n` plus 1.
    >>> increment(0)
    1
    >>> increment(12)
    13
    """

    return n

# Exercise define the is_zero function.
def is_zero(n):
    """
    If n is zero return True otherwise return False.
    >>> is_zero(1)
    False
    >>> is_zero(12)
    False
    >>> is_zero(0)
    True
    """

    return None

# Exercise define the decrement function.
def decrement(n):
    """
    The decrement functions returns `n` minus 1.
    >>> decrement(0)
    -1
    >>> decrement(12)
    11
    """

    return n

def log10(x):
    """
    An estimate of the log10 of the given argument.
    >>> log10(100)
    2
    >>> log10(10)
    1
    >>> log10(10 ** 12)
    12
    >>> log10(9)
    0
    """
    # base case: if x is smaller than 10 then we return 0
    # recursive case - x is greater than 10:
    #     create variable to hold the value x/10
    #     return 1 + a recursive call with the variable created above
    return None

def log2(x):
    """
    An estimate of the log10 of the given argument.
    >>> log2(128)
    7
    >>> log2(16)
    4
    >>> log2(2 ** 12)
    12
    >>> log2(1)
    0
    """
    # the log2 function is identical to the log10 function except that testing if x is smaller
    # than 10 and dividing by 10 you want to test if it's smaller than 2 and divide by 2
    return None

# Exercise: define the greatest_common_divisor function using the Euclid's algorithm.
#
# Use the following table to implement the greatest common divisor function
# branch property | return value
# ----------------+------------------------------------------------
# x > y           | greatest_common_divisor(x - y, y)
# y > x           | greatest_common_divisor(x, y - x)
# x == y          | x
def greatest_common_divisor(x, y):
    """
    The greatest common divisor between x and y.
    >>> greatest_common_divisor(12, 12)
    12
    >>> greatest_common_divisor(48, 8)
    8
    >>> greatest_common_divisor(48, 18)
    6
    >>> greatest_common_divisor(21, 3)
    3
    >>> greatest_common_divisor(12, 13)
    1
    """

    return None

# Exercise: read this Standard coding segments: https://sl.bing.net/joDmXp3k5NQ and use it
# to help you write a function named least_common_multiple that uses greatest_common_divisor to
# calculate the least common multiple of two arguments.

def main():
    """
    Main function. doctest and ipython
    """

    doctest.testmod()
    #IPython.embed()

if __name__ == "__main__":
    main()
