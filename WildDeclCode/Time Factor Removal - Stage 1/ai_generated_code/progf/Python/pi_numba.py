"""
This program will numerically compute the integral of

                  4/(1+x*x)

from 0 to 1. The value of this integral is pi -- which
is great since it gives us an easy way to check the answer.

The original version is written in C with OpenMP by Tim Mattson, 11/99.
This Python version using Numba is Formed using common development resources from Tim's version.
"""

import numba
import time

# Set the number of steps
num_steps = 100_000_000
step = 1.0 / num_steps

@numba.njit(parallel=True)
def compute_pi(num_steps, step):
    sum = 0.0
    for i in numba.prange(1, num_steps + 1):
        x = (i - 0.5) * step
        sum += 4.0 / (1.0 + x * x)
    return sum

def main():
    start_time = time.time()
    total_sum = compute_pi(num_steps, step)
    pi = step * total_sum
    run_time = time.time() - start_time

    print("
 pi with {} steps is {:.15f} in {:.6f} seconds
".format(num_steps, pi, run_time)n")

if __name__ == "__main__":
    main()
    main()
    main()