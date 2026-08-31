```python
# mutation
genomes = []
for i in range(int(N_POPULATION / (N_BEST + N_CHILDREN))):
  for bg in best_genomes:
    new_genome = deepcopy(bg)

    mean = 20
    stddev = 10

    if random.uniform(0, 1) < PROB_MUTATION:
      new_genome.w1 += new_genome.w1 * np.random.normal(mean, stddev, size=(6, 10)) / 100 * np.random.randint(-1, 2, (6, 10))
    if random.uniform(0, 1) < PROB_MUTATION:
      new_genome.w2 += new_genome.w2 * np.random.normal(mean, stddev, size=(10, 20)) / 100 * np.random.randint(-1, 2, (10, 20))
    if random.uniform(0, 1) < PROB_MUTATION:
      new_genome.w3 += new_genome.w3 * np.random.normal(mean, stddev, size=(20, 10)) / 100 * np.random.randint(-1, 2, (20, 10))
    if random.uniform(0, 1) < PROB_MUTATION:
      new_genome.w4 += new_genome.w4 * np.random.normal(mean, stddev, size=(10, 3)) / 100 * np.random.randint(-1, 2, (10, 3))

    genomes.append(new_genome)
```