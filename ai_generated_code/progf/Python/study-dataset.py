# This script has been written with the help of GitHub CoPilot
# I am using the free Beta version
# One can use this script as a template to explore their own dataset or
# Use this as an example to construct their own script for understanding the underlying patterns of a dataset
# with the help of GitHub CoPilot

# Read datasets/kaggle-us-population/data.csv and explore the dataset

import pandas as pd

# Read the dataset
df = pd.read_csv('datasets/kaggle-us-population/data.csv')
metadata = pd.read_csv('datasets/kaggle-us-population/metadata.csv')


# Write a function that takes in the dataset and explores columns in the dataset, 
# explores the shape of the dataset, and explores the first 5 rows of the dataset, 
# and also explores the datatypes of the columns of the dataframe

def explore_dataset(df):
    print(df.columns)
    print(df.shape)
    print(df.head())
    print(df.dtypes)

explore_dataset(df)

# View all reports in the metadata
print(metadata.report.value_counts())

time_series_codes = metadata[metadata.report == 'Housing Vacancies and Homeownership'].time_series_code.tolist()
time_series_code_dict = {}

# Save all the time_series_codes and dt_desc in form of a dictionary for report 'Housing Vacancies and Homeownership' from metadata
# In time_series_code_dict keep codes only with geo_desc United States from metadata
time_series_code_dict = {time_series_code: metadata[metadata.time_series_code == time_series_code].dt_desc.tolist()[0] for time_series_code in time_series_codes if metadata[metadata.time_series_code == time_series_code].geo_desc.tolist()[0] == 'United States'}
print(time_series_code_dict)

# Write a function that reads in df dataset and only keeps rows which are in time_series_code_dict
# Also add a column to the dataframe which has the dt_desc corresponding to the time_series_code
def filter_df(data, ts_dict):
    data = data[data.time_series_code.isin(ts_dict.keys())]
    data['dt_desc'] = data.time_series_code.apply(lambda x: ts_dict[x])
    return data

df = filter_df(df, time_series_code_dict)
print(df.shape)
print(df.head())

# Write a function that takes in the dataframe df and creates plots for each time_series_code
# The plots should be saved in the folder datasets/kaggle-us-population/plots
# The plots should be saved in the format dt_desc.png
# The plots should have the following properties:
# 1. The title of the plot should be the dt_desc
# 2. The x-axis should be the year
# 3. The y-axis should be the value in Thousands of Units
# 4. The legend should be the dt_desc

import plotly.express as px

df['year'] = df.date.apply(lambda x: x.split('-')[0])
df['month'] = df.date.apply(lambda x: x.split('-')[1])

def create_plots(df):
    for ts_code in df.time_series_code.unique():
        data = df[df.time_series_code == ts_code]
        fig = px.line(data, x='year', y='value', title=data.dt_desc.tolist()[0], color='dt_desc')
        fig.write_image('datasets/kaggle-us-population/plots/' + str(data.dt_desc.tolist()[0]) + '.png')


create_plots(df)


