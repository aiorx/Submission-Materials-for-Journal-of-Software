import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Read the data from the CSV file
data = pd.read_csv("fake_data.csv")
original_data = data.copy()

# Print the first 5 rows of the DataFrame
print(data)

# Print EDA
print(data.describe())
print(data.info())
print(data.isna().sum())

# Remove Duplicates
data = data.drop_duplicates()

# Drop the rows & Columns with NaN values
data = data.dropna(axis=0, how="any")
data = data.dropna(axis=1, how="any")

# Replace YES/NO with 1/0
data["Rain"] = data["Rain"].replace("YES", 1)
data["Rain"] = data["Rain"].replace("NO", 0)

# Print EDA After Droping NaN values
print(data.describe())
print(data.info())
print(data.isna().sum())

# Save the cleaned data to a new CSV file
data.to_csv("fake_data_cleaned.csv", index=False)



# All The Explaination is Aided via basic GitHub coding utilities
# This Python script is used for data cleaning. It imports the necessary libraries such as NumPy, Pandas, and Matplotlib. The data is read from a CSV file named "fake_data.csv" using the Pandas library. The first 5 rows of the DataFrame are printed using the `head()` method to check if the data is being read correctly. 

# The script then performs exploratory data analysis (EDA) on the data using the `describe()`, `info()`, and `isna().sum()` methods. The `describe()` method provides a summary of the statistical measures of the data, such as mean, standard deviation, and quartiles. The `info()` method provides information about the DataFrame, such as the number of rows, columns, and data types. The `isna().sum()` method returns the number of missing values in each column of the DataFrame.

# The script then drops the rows and columns with missing values using the `dropna()` method. The `axis` parameter is set to 0 and 1 to drop rows and columns, respectively. The `how` parameter is set to "any" to drop any row or column that contains at least one missing value.

# The script then replaces the "YES" and "NO" values in the "Rain" column with 1 and 0, respectively, using the `replace()` method. This is done to convert the categorical data into numerical data.

# After dropping the missing values and replacing the categorical data, the script performs EDA again using the `describe()`, `info()`, and `isna().sum()` methods to check if the data has been cleaned properly.

# Finally, the cleaned data is saved to a new CSV file named "fake_data_cleaned.csv" using the `to_csv()` method. The `index` parameter is set to False to prevent the index column from being saved in the CSV file.

# To improve the readability of the code, the comments could be more descriptive and provide more information about the purpose of each step. Additionally, the code could be optimized for performance by avoiding the creation of unnecessary variables and using vectorized operations instead of loops.