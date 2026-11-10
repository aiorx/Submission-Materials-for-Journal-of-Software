```python
def broken_1(m):
    """
    What comes in: a positive integer m that is at least 2.
    What goes out:  Returns the number of prime numbers
      between m and (2m + 1) inclusive.
    Side effects:  None.
    Examples:
      If m is 3, this function returns 3 because there are 3 primes
      between 3 and 7 inclusive:  3, 5, and 7.
    """
    count = 0
    for k in range(m, 2 * m + 1):
        if is_prime(k):
            count = count + 1
    return count
```