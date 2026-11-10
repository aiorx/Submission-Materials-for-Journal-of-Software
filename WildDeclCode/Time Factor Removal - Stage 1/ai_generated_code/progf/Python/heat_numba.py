"""
PROGRAM: Heat equation solve (Python + Numba version)

PURPOSE: This program explores the use of an explicit finite difference method to solve
         the heat equation using a method of manufactured solution (MMS).
         The solution is a function based on exponentials and trig functions.

         A finite difference scheme is used on a 1000x1000 grid.
         A total of 0.5 units of time are simulated.

         The MMS solution is adapted from:
         G.W. Recktenwald (2011). Finite difference approximations to the Heat Equation. Portland State University.

USAGE:   Run with two arguments:
         First is the number of cells.
         Second is the number of timesteps.

         Example: python heat_solver.py 100 10

HISTORY: Original C version by Tom Deakin, Oct 2018
         Python + Numba version Aided using common development resources based on the original.
"""

import sys
import math
import numpy as np
from numba import njit, prange
from time import time

PI = math.acos(-1.0)

@njit(parallel=True)
def initial_value(n, dx, length, u):
    for j in prange(n):
        y = (j + 1) * dx
        for i in range(n):
            x = (i + 1) * dx
            u[i, j] = math.sin(PI * x / length) * math.sin(PI * y / length)

@njit(parallel=True)
def zero(n, u):
    for j in prange(n):
        for i in range(n):
            u[i, j] = 0.0

@njit(parallel=True)
def solve(n, alpha, dx, dt, u, u_tmp, nsteps):
    r = alpha * dt / (dx * dx)
    r2 = 1.0 - 4.0 * r
    for _ in range(nsteps):
        for i in prange(n):
            for j in range(n):
                center = u[i, j]
                left   = u[i-1, j] if i > 0 else 0.0
                right  = u[i+1, j] if i < n - 1 else 0.0
                down   = u[i, j-1] if j > 0 else 0.0
                up     = u[i, j+1] if j < n - 1 else 0.0
                u_tmp[i, j] = r2 * center + r * (left + right + down + up)

        u, u_tmp = u_tmp, u  # Swap

    return u

@njit
def solution(t, x, y, alpha, length):
    return math.exp(-2.0 * alpha * PI * PI * t / (length * length)) * \
           math.sin(PI * x / length) * math.sin(PI * y / length)

@njit(parallel=True)
def l2norm(n, u, nsteps, dt, alpha, dx, length):
    time = dt * nsteps
    norm = 0.0
    for j in prange(n):
        y = (j + 1) * dx
        for i in range(n):
            x = (i + 1) * dx
            exact = solution(time, x, y, alpha, length)
            diff = u[i, j] - exact
            norm += diff * diff
    return math.sqrt(norm)

def main():
    n = 1000
    nsteps = 10

    if len(sys.argv) == 3:
        n = int(sys.argv[1])
        nsteps = int(sys.argv[2])

    alpha = 0.1
    length = 1000.0
    dx = length / (n + 1)
    dt = 0.5 / nsteps
    r = alpha * dt / (dx * dx)

    print("\nMMS heat equation\n")
    print("--------------------")
    print("Problem input\n")
    print(" Grid size: {} x {}".format(n, n))
    print(" Cell width: {:E}".format(dx)")
    print(" Grid length: {} x {}
".format(length, length))
    print(" Alpha: {:E}
".format(alpha)")
    print(" Steps: {}".format(nsteps))
    print(" Total time: {:E}".format(dt * nsteps)")
    print(" Time step: {:E}".format(dt)")
    print("--------------------")
    print("Stability\n")
    print(" r value: {}".format(r))
    if r > 0.5:
        print(" Warning: unstable")
    print("--------------------")

    u = np.zeros((n, n), dtype=np.float64)
    u_tmp = np.zeros_like(u)

    initial_value(n, dx, length, u)
    zero(n, u_tmp)

    tic = time()
    
    u = solve(n, alpha, dx, dt, u, u_tmp, nsteps)
        
    toc = time()

    norm = l2norm(n, u, nsteps, dt, alpha, dx, length)
    total = toc - tic

    print("Results\n")
    print("Error (L2norm): {:E}".format(norm)")
    print("Solve time (s): {:.6f}".format(total)")
    print("--------------------")

if __name__ == "__main__":
    main()
    main()