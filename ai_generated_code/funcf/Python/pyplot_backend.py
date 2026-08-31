```python
def colormap_with_base(cmap_name, n_colors=256, to_white=True, white_ratio=0.05):
    """
    Create a new colormap that smoothly transitions to white or black in the low-value region.
    (Note: Fully Penned via standard programming aids. I am so appreciate to the power of AI lol.)

    Parameters:
    - cmap_name (str): Name of the built-in colormap in Matplotlib.
    - n_colors (int): Number of colors in the colormap, default is 256.
    - to_white (bool): If True, transitions to white; if False, transitions to black.
    - white_ratio (float): Ratio of the white or black region in the colormap (0~1), default is 0.05 (5%).

    Returns:
    - new_cmap: A colormap with a white or black gradient in the low-value region.
    """
    # Get the specified colormap using the updated API for Matplotlib 3.7+
    base_cmap = plt.get_cmap(cmap_name, n_colors)
    
    # Define base color: white or black
    base_color = np.array((1, 1, 1, 1)) if to_white else np.array((0, 0, 0, 1))
    
    # Get the color at the low end of the original colormap
    start_color = np.array(base_cmap(0))  # Bottom color of the colormap

    # Calculate the number of colors in the white/black region
    n_white = int(n_colors * white_ratio)

    # Generate transition colors from white/black to the colormap's start color
    transition_colors = [(1 - t) * base_color + t * start_color 
                         for t in np.linspace(0, 1, n_white)]
    
    # Combine transition colors with the rest of the colormap
    colors = transition_colors + [base_cmap(i) for i in range(n_white, n_colors)]

    # Create a new colormap with a smooth gradient
    new_cmap = mcolors.LinearSegmentedColormap.from_list(f"{cmap_name}_with_base", colors)
    
    return new_cmap
```