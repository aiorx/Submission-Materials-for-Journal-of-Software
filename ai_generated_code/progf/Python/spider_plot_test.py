Python

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Sample data
data = {
    'circuit': ['circuit1', 'circuit2'],
    'timing': [-1.3, -1.5],
    'power': [50, 52],
    'area': [600, 500]
}

df = pd.DataFrame(data)

# Number of variables
categories = list(df.columns[1:])
N = len(categories)

# What will be the angle of each axis in the plot? (we divide the plot / number of variables)
angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

# Initialise the spider plot
fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

# Draw one axe per variable + add labels
plt.xticks(angles[:-1], categories)

# Draw ylabels
ax.set_rlabel_position(0)
plt.yticks([0, 100, 200, 300, 400, 500, 600], ["0", "100", "200", "300", "400", "500", "600"], color="grey", size=7)
plt.ylim(-2, 600)

# Plot data for each circuit
for i in range(len(df)):
    values = df.loc[i].drop('circuit').values.flatten().tolist()
    values += values[:1]
    ax.plot(angles, values, linewidth=1, linestyle='solid', label=df['circuit'][i])
    ax.fill(angles, values, alpha=0.1)

# Add a legend
plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))

# Show the plot
plt.show()

# Routine programming code snippets. Review and use carefully. More info on FAQ.
