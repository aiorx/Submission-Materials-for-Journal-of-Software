```python
def visualize_optimization_process(solutions:list, fitness_function, make_contour=True, global_opt:list=None, label=None):
    "Generated with Copilot partly"

    # Convert solutions to numpy array for easier indexing
    solutions = np.array(solutions)

    if make_contour:
        # Increase the default font size
        plt.rc('font', size=20) 
        # Create a grid of points
        if global_opt:
            x = np.linspace(min(global_opt[0], min(solutions[:, 0]))-2, max(global_opt[0],max(solutions[:, 0]))+2, 100)
            y = np.linspace(min(global_opt[1], min(solutions[:, 1]))-2, max(global_opt[1],max(solutions[:, 1]))+2, 100)
        X, Y = np.meshgrid(x, y)

        # Calculate fitness for each point on the grid
        Z = np.array([fitness_function([x, y]) for x, y in zip(np.ravel(X), np.ravel(Y))])
        Z = Z.reshape(X.shape)

        # Plot the contour map
        plt.contourf(X, Y, Z, levels=20, cmap='viridis')
        plt.colorbar()

    # Plot the solutions
    plt.plot(solutions[:, 0], solutions[:, 1], '.-', label=f"{label}")
    plt.text(solutions[-1, 0], solutions[-1, 1], f'End {label}')
    if global_opt:
        plt.text(solutions[0, 0], solutions[0, 1], f'Start', color='blue') 
        plt.plot(global_opt[0], global_opt[1], 'y*', markersize=5, label='optimum')
```