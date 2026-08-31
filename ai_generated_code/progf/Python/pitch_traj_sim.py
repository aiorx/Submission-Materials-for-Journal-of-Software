"""
Calculate pitch trajectory considering
- Initial velocity
- Spin rate and axis
- Relase Height
Forces acting on the ball:
- Magnus force
- Drag force
- Gravity
Initially Supported via standard programming aids. All vibe
Spins and velocities parameters are from Kyle Hendricks statcast + made up.
Definition of axis (centred at pitcher's foot):
X - mount to plate.
Y - Left/Right. Positive is to the left (RHP's glove-side)
Z - Vertical. 0 is ground. Positive is above ground.
Thus it is a right-hand axes
"""

import numpy as np

from .units import rpm_to_radps, feet_to_meter

# Constants
dt = 0.001  # time step (s)
mass = 0.145  # kg
radius = 0.037  # m
r = radius
m = mass
A = np.pi * r**2  # cross-sectional area (m^2)
area = np.pi * radius**2  # m²
rho = 1.225  # kg/m³
Cd = 0.3  # drag coefficient
Cl = 0.00021  # lift coefficient scale factor
g = np.array([0, 0, -9.81])  # gravity vector m/s²
RELEASE_HEIGHT = 1.86
MOUND2PLATE_METERS = 18.44  # distance from mound to plate in meters


def calc_cl(omega, v, radius):
    """Dynamic calculation of lift coefficient based on spin (rad/s) and velocity (m/s) and radius (m) of the ball."""
    # Spin parameter S = r * omega / v
    speed = np.linalg.norm(v)
    spin_rate = np.linalg.norm(omega)
    if speed == 0:
        return 0
    S = radius * spin_rate / speed
    return 1.6 * S  # empirical scaling from Nathan et al.

def drag_force(v):
    """Calculate the drag force on the ball based on velocity (m/s)."""
    v_mag = np.linalg.norm(v)
    if v_mag == 0:
        return np.zeros(3)
    return -0.5 * rho * A * Cd * v_mag * v

def magnus_force(omega, v):
    """Calculate the Magnus force on the ball based on spin (rad/s) and velocity (m/s)."""
    v_mag = np.linalg.norm(v)
    if v_mag == 0:
        return np.zeros(3)
    Cl = calc_cl(omega, v, radius)
    magnus_dir = np.cross(omega, v)
    magnus_dir_mag = np.linalg.norm(magnus_dir)
    if magnus_dir_mag == 0:
        return np.zeros(3)
    magnus_unit = magnus_dir / magnus_dir_mag
    # Full aerodynamic Magnus force
    F_magnus_mag = 0.5 * rho * A * Cl * v_mag**2
    return F_magnus_mag * magnus_unit

def simulate_pitch_3d(params, dt=0.001, max_time=1.0):
    spin_axis = np.array(params["axis"])
    spin_axis = spin_axis / np.linalg.norm(spin_axis)
    omega = rpm_to_radps(params["spin_rpm"]) * spin_axis
    if "p0" in params:
        pos = params["p0"].copy()
    else:
        pos = np.array([0, 0, RELEASE_HEIGHT])  # release height ~1.8m
    if "v0_meterspersec" in params:
        v = np.array(params["v0_meterspersec"], dtype=float)
    else:
        v = feet_to_meter(np.array(params["v0_feetpersec"], dtype=float))
    #omega_rps = params["spin_rpm"] / 60 * 2 * np.pi  # rpm -> rad/s
    #omega = np.array(params["axis"]) * omega_rps
    positions = [pos.copy()]
    velocities = [v.copy()]
    times = [0]
    t = 0
    
    while pos[0] < MOUND2PLATE_METERS and pos[2] > 0 and t < max_time:  # ~60.5 ft to home plate
        F_drag = drag_force(v)
        F_magnus = magnus_force(omega, v)
        F_gravity = m * g
        
        a = (F_drag + F_magnus + F_gravity) / m
        v += a * dt
        pos += v * dt
        t += dt
        
        positions.append(pos.copy())
        velocities.append(v.copy())
        times.append(t)
        
    return np.array(positions), np.array(velocities), times
