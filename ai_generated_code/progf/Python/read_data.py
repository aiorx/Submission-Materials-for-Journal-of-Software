import pandas as pd 
import numpy as np 
import matplotlib.pyplot as plt 


def get_angular_size(r_h):
	'''Go  from half light radius to true radius, based on King (1966) model for half light radius.
	Takes half light radius, in arcmin, and multiply by 2.5 to get angular radius.
	Multiply by 2 again to get angular diameter (angular size)
	'''
	return 2.5 * r_h * 2


def get_true_diameter(angular_size, dist):
	'''Takes angular size, in arcmin, and distance from Sun, in pc,
	Calculates true diameter (in pc)
	'''
	diam_rad = angular_size * (2.9089 * 10**-4) # 2.9089 * 10^-4 rad = 1 arcmin
	return diam_rad * dist 


# GLOBULAR CLUSTER DATA READING
glob_data1 = pd.read_csv("glob_data.txt", skiprows = 72, nrows = 156, delim_whitespace = True, header = None)
glob_data2 = pd.read_csv("glob_data.txt", skiprows = 252, nrows = 156, delim_whitespace = True, header = None)
glob_data3 = pd.read_csv("glob_data.txt", skiprows = 433, nrows = 156, delim_whitespace = True, header = None)

# Combining the first two columns because the names were split
glob_data1["Cname"] = glob_data1.iloc[:,0] + glob_data1.iloc[:,1].astype(str)


glob_data = pd.concat([glob_data1["Cname"], glob_data1.iloc[:,4:10], glob_data1.iloc[:,12], glob_data2.iloc[:,4], glob_data3.iloc[:,8]], axis = 1)
glob_data.columns = ["Cname", "RA1", "RA2","RA3", "Dec1", "Dec2", "Dec3", "R_sun", "E(B-V)","r_h" ]


# OPEN CLUSTER DATA READING
open_data = pd.read_csv("open_data.tsv", skiprows = 39, delimiter = "\t", header = None)

# Code Supported via standard programming aids-4o (OpenAI, 2024) - November 2024 version, Prompt: "I have too many whitespace missing values in my dataset, how do I remove them?"
open_data = open_data.applymap(lambda x: x.strip() if isinstance(x, str) else x)  # Remove leading/trailing spaces
open_data.replace('', pd.NA, inplace=True)  # Replace empty strings with NaN
open_data = open_data.dropna()

open_data.columns = ["RA", "Dec", "Diam", "Dist", "Age (log years)", "Metallicity", "E(B-V)", "Cname", "_RA.icrs", "_DE.icrs"]

print("Globular Data","\n")
print(glob_data.head(100))

print("Open Data", "\n")
print(open_data)


# -----------------------TEST PLOT FUNCTIONS---------------------------------------------------
