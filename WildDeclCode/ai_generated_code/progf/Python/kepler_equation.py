import math
import time

G = 6.67430e-11


def modulus(n):
    M_mod = n % 360
    if M_mod >= 180:
        M_mod = M_mod - 360
    return M_mod


# Assisted with basic coding tools
def eccentric_anomaly(M, e, a, central_body_mass=1.9891e30, time_since_epoch=0.0, tolerance=1e-10, max_iterations=100):
    # Calculate mean motion n
    n = math.sqrt((G * central_body_mass) / a ** 3)

    # Calculate mean anomaly at time_since_epoch
    M = M + n * time_since_epoch

    # Normalize M to be within [0, 2π]
    M = M % (2 * math.pi)

    # Initial guess for E
    E = M if e < 0.8 else math.pi  # A good initial guess can depend on e

    for i in range(max_iterations):
        # Calculate the value of f(E) and its derivative f'(E)
        f_E = E - e * math.sin(E) - M
        f_prime_E = 1 - e * math.cos(E)

        # Update E using Newton's method
        E_new = E - f_E / f_prime_E

        # Check for convergence
        if abs(E_new - E) < tolerance:
            # print(f"Iterations: {i + 1}")
            return E_new

        E = E_new

    # If we reach here, we didn't converge
    raise ValueError("Eccentric anomaly did not converge")


if __name__ == '__main__':
    M = 0  # math.radians(355.43)  # Mean anomaly in radians
    e = 0.09339410  # Eccentricity
    a = 1.52371034 * 1.495978707e11  # Convert from AU to metres

    # Calculate orbital period in seconds
    T_orb = 2 * math.pi * math.sqrt(a ** 3 / (G * 1.9891e30))  # This works.
    print(f"Orbital period: {T_orb / 86400} days")

    ref_time = time.time()
    while True:
        time_since_epoch = time.time() - ref_time

        # Timescale of one simulated day per realtime second
        E = eccentric_anomaly(M, e, a, 1.9891e30, time_since_epoch * 86400)
        print(f"Eccentric anomaly at time {time_since_epoch:.2f} days: {math.degrees(E):.6f}")
        time.sleep(1)
