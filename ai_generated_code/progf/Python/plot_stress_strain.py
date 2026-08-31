# Assisted using common GitHub development utilities
import pandas as pd
import matplotlib.pyplot as plt

# Read the Excel file (skip the first line if it contains comments)
df = pd.read_excel('Leaf Spring.xlsx', comment='/')

# Extract Stress and Strain columns
stress = df['Applied load, W (kN)']
strain = df['Deflection (mm)']

# Plot Stress vs. Strain
plt.figure(figsize=(20,10))
plt.plot(strain, stress, marker='o', linestyle='-')
plt.xlabel('Deflection (mm)')
plt.ylabel('Applied load, W (kN)')
plt.title('Deflection vs. Applied Load')
plt.grid(True)
plt.tight_layout()
plt.show()
