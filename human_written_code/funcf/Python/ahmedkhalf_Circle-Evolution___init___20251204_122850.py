```python
from circle_evolution import evolution
from circle_evolution import helpers
import numpy as np
import cv2

# Load target image of size (64, 64)
target = helpers.load_target_image("Mona Lisa 64.jpg", size=(64, 64))

# Setup evolution
e = evolution.Evolution(target, genes=256)

# Evolve for 50k generations
e.evolve(max_generation=50000)

# Show evolved phenotype
helpers.show_image(e.specie.phenotype)

# Saves genotype to checkpoint
np.savetxt("Checkpoint.txt", e.specie.genotype)

# Saves phenotype
cv2.imwrite("OuputImage.jpg", e.specie.phenotype)
```