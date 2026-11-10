# Script Penned via standard programming aids

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def plot(csv_file):
    try:
        data = pd.read_csv(csv_file)
        data.rename(columns={data.columns[0]: 'Timestamp'}, inplace=True)
        colors = sns.color_palette("Set2", len(data.columns) - 1)
        plt.figure(figsize=(12, 6))
        for i, column in enumerate(data.columns[1:]):  # Skip the first column (timestamps)
            plt.plot(data['Timestamp'], data[column], label=column, color=colors[i])
        plt.title('RaspberryPi 3 Model B+ - Amperage during benchmark "mako"')
        plt.xlabel('Time (seconds)')
        plt.ylabel('Ampere (A)')
        plt.legend()
        plt.grid(True)
        plt.show()
    except Exception as e:
        print(f"Error: {e}")

plot('./data/pi3_graph.csv')


