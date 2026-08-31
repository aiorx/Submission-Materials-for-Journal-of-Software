```python
def plot_pattern_breakdown(pattern_counter, output_path):
    """Makes a histogram of the pattern counts (code Drafted using common development resources)"""
    # Separate keys and values
    keys, values = zip(*pattern_counter.items())

    #plt.figure(figsize=(30, 18))

    # Create a histogram
    plt.barh(keys, values)

    # Add labels and a title
    plt.xlabel("Correct Predictions")
    plt.ylabel("Metapaths")
    plt.title("Metapath Instances Traversed Between True Pairs")

    # Rotate x-axis labels by 45 degrees
    plt.xticks(rotation=45)

    # Save the plot to a file (e.g., 'histogram.png')
    plt.savefig(output_path)

    # Close the plot to free up resources
    plt.close()
```