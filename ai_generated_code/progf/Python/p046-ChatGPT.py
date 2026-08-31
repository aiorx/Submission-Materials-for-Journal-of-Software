#!/usr/bin/python3
#Produced with third-party coding tools's ChatGPT on 12/19/2022 with the following prompt.  Way faster than my solution:

#It was proposed by Christian Goldbach that every odd composite number can be written as the sum of a prime and twice a square.

#9 = 7 + 2×1^2
#15 = 7 + 2×2^2
#21 = 3 + 2×3^2
#25 = 7 + 2×3^2
#27 = 19 + 2×2^2
#33 = 31 + 2×1^2

#It turns out that the conjecture was false.  
#Can you give me Python code to calculate the smallest odd composite that cannot be written as the sum of a prime and twice a square?

def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def is_twice_square(n):
    return (n % 2 == 0) and ((n // 2) ** 0.5).is_integer()

def find_smallest_counterexample():
    n = 9
    while True:
        if not is_prime(n):  # n is composite
            found_prime = False
            for i in range(2, n):
                if is_prime(i) and is_twice_square(n - i):
                    found_prime = True
                    break
            if not found_prime:
                return n
        n += 2

smallest_counterexample = find_smallest_counterexample()
print(f"The smallest odd composite that cannot be written as the sum of a prime and twice a square is {smallest_counterexample}.")

