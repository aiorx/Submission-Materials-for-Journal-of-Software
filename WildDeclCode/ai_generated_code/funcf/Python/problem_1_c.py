```python
def graphPopulation(pop):
    # Assisted using common GitHub development utilities
    # Extract chromosomes and fitness values
    chromosomes = [p[0] for p in pop]
    fitness = [p[1] for p in pop]

    # If 2D problem, create a scatter plot
    if dimensions == 2:
        fig = plt.figure(figsize=(10, 8))
        ax = fig.add_subplot(111, projection='3d')

        # Plot population points
        x = [c[0] for c in chromosomes]
        y = [c[1] for c in chromosomes]

        # Create scatter plot of population
        ax.scatter(x, y, fitness, c='blue', marker='o', label='Population')

        # Highlight the best solution
        ax.scatter(chromosomes[0][0], chromosomes[0][1], fitness[0],
                  c='red', marker='*', s=200, label='Best Solution')

        ax.set_xlabel('X1')
        ax.set_ylabel('X2')
        ax.set_zlabel('Fitness Value')
        ax.set_title('Population in Schwefel Function Search Space')
        ax.legend()

        plt.show(block=False)
        plt.pause(10)
    elif dimensions > 2:
        print("Population visualization not available for dimensions > 2")
    print ("Best solution: ", pop[0][0])
    print ("Value: ", pop[0][1])
```