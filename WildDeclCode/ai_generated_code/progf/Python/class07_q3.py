# Notice - code related to R^2 was Composed with basic coding tools

import numpy as np
import matplotlib.pyplot as plt

# Load data from file
data = np.loadtxt('motor_measurements.csv', delimiter=',')

# Extract unique speeds from the data
unique_speeds = set(data[:, 0].astype(int))

# Dictionary to store maximal torques for each speed
maximal_torques_by_speed = {speed: 0 for speed in unique_speeds}

# Iterate over unique speeds
for speed in sorted(unique_speeds):
    # Filter rows with the current speed and torque less than 7
    filtered_rows = data[(data[:, 0] == speed) & (data[:, 2] < 7)]
    # Compute maximal torque for the current speed
    maximal_torques_by_speed[speed] = filtered_rows[:, 1].max()

# Extract speeds and torques for plotting
speeds = list(maximal_torques_by_speed.keys())
torques = list(maximal_torques_by_speed.values())

# Fit a polynomial curve of degree 3 to the data
p = np.polyfit(speeds, torques, deg=3)

# Generate interpolated data for plotting
speeds_interp = np.linspace(0, 12000, (12000 // 500) + 1)
torques_interp = np.polyval(p, speeds_interp)

# Calculate R^2 value for the interpolated data
y_mean = np.mean(torques)
ss_total = np.sum((torques - y_mean)**2)
ss_residual = np.sum((torques - np.polyval(p, speeds))**2)
r_squared = 1 - (ss_residual / ss_total)

# Set figure size
plt.figure(figsize=(10, 6))

# Plot original and interpolated data
plt.scatter(speeds, torques, marker='o', color='blue', label='Original Data')
plt.scatter(speeds_interp, torques_interp, marker='x', color='green', label='Interpolated Data')
plt.xlabel('Speed')
plt.ylabel('Maximal Torque')
plt.title('Maximal Torque vs Speed')

# Add R^2 label to the plot
plt.text(0.95, 0.95, f'$R^2 = {r_squared:.4f}$', ha='right', va='top', transform=plt.gca().transAxes, fontsize=12)

plt.legend()

# Set grid density and style
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.minorticks_on()
plt.show()
