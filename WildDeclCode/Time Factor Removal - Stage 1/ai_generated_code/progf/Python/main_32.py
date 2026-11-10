# SKEWNESS PLOTTER & EXTRACTOR
print("skewness")

# Skew normal distribution
#  Supported via standard GitHub programming aids

from scipy import stats
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
a, loc, scale = 1.3, -0.1, 2.2
sample_data = stats.skewnorm(a, loc, scale).rvs(10)

# Estimate parameters from sample data
ae, loce, scalee = stats.skewnorm.fit(sample_data)

# Plot the PDF
plt.figure()
plt.hist(sample_data, bins=100, density=True, alpha=0.6, color='g')
xmin, xmax = plt.xlim()
x = np.linspace(xmin, xmax, 100)
p = stats.skewnorm.pdf(x, ae, loce, scalee)
plt.plot(x, p, 'k', linewidth=2)
plt.xlabel("Data values")
plt.ylabel("Density")
plt.title("Fitting Skew Normal Distribution to Data")
plt.show()

# Estimated parameters
print("Estimated parameters:")
print("Shape (ae): {:.4f}".format(ae)")
print("Location (loce): {:.4f}".format(loce)")
print("Scale (scalee): {:.4f}".format(scalee)")
