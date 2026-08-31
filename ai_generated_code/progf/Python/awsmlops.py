'''
STEP 1.0 - Data Management. Clean Text Data
'''

"""
    NAME: remove_characters
    PURPOSE: Remove specified characters from a given column in a DataFrame.

    INPUT PARAMETERS:
    df (pd.DataFrame): The DataFrame containing the column.
    column (str): The name of the column from which to remove characters.
    chars_to_remove (list): A list of characters to remove from the column.

    OUTPUT/RETURNS:
    pd.DataFrame: The DataFrame with the specified characters removed from the column.
"""
import pandas as pd

def remove_characters(df, column, chars_to_remove):
    # Create a regex pattern from the list of characters to remove
    pattern = '[' + ''.join(chars_to_remove) + ']'

    # Use str.replace to remove the characters
    df[column] = df[column].str.replace(pattern, '', regex=True)

    return df








"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
import subprocess
import sys

def uninstall_package(package_name):
    subprocess.check_call([sys.executable, "-m", "pip", "uninstall", package_name, "-y"])







"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
Python function that drops all non-float columns from a pandas DataFrame:

'''
import pandas as pd

def drop_non_float_columns(df):
    """
    Drops all non-float columns from the DataFrame.

    Parameters:
    df (pd.DataFrame): The input DataFrame.

    Returns:
    pd.DataFrame: A DataFrame with only float columns.
    """
    float_columns = df.select_dtypes(include=['float64']).columns
    return df[float_columns]


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
import pandas as pd

def keep_columns_with_prefixes(df, prefixes):
    """
    Keeps only the columns in the DataFrame that begin with prefixes specified in the list.

    Parameters:
    df (pd.DataFrame): The input DataFrame.
    prefixes (list): A list of prefixes to match.

    Returns:
    pd.DataFrame: A DataFrame with only the columns that begin with the specified prefixes.
    """
    # Create a list of columns to keep
    columns_to_keep = [col for col in df.columns if any(col.startswith(prefix) for prefix in prefixes)]
    return df[columns_to_keep]

# List of prefixes
# prefixes = ['SDOH', 'MM', 'HCOSTS', 'HUTIL']


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
CORRELATION MATRIX


create a python function to take a dataframe as input to produce a correlation matrix with sample data to produce a correlation matrix visual

Sure! Here’s a Python function that takes a DataFrame as input, calculates the correlation matrix, and then visualizes it using a heatmap. I’ll also include some sample data to demonstrate how it works.


This function first calculates the correlation matrix using the .corr() method from Pandas. Then, it uses Seaborn to create a heatmap of the correlation matrix. The sample data provided creates a DataFrame with four columns, and the function visualizes the correlations between these columns.

Feel free to modify the sample data or use your own DataFrame to see how the correlations look! If you have any questions or need further customization, just let me know.
'''
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def plot_correlation_matrix1(df):
    # Calculate the correlation matrix
    corr_matrix = df.corr()

    # Plot the heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', linewidths=0.5)
    plt.title('Correlation Matrix')
    plt.show()



"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
Python function that produces a correlation matrix:
'''
import plotly.express as px
import pandas as pd

def plot_correlation_matrix2(df):
    # Calculate the correlation matrix
    corr_matrix = df.corr()

    # Create the heatmap with tooltips
    fig = px.imshow(corr_matrix,
                    text_auto=True,
                    aspect="auto",
                    labels=dict(color="Correlation"),
                    color_continuous_scale='Blues',  # Blue gradient
                    zmin=-1, zmax=1)

    # Update layout for better readability
    fig.update_layout(title='Correlation Matrix',
                      xaxis_title='Features',
                      yaxis_title='Features')

    # Show the plot
    fig.show()






"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
This function now masks the upper triangle of the correlation matrix, displaying only the lower triangle
'''
import plotly.express as px
import pandas as pd
import numpy as np

def plot_correlation_matrix3(df):
    # Calculate the correlation matrix
    corr_matrix = df.corr()

    # Generate a mask for the upper triangle
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))

    # Apply the mask to the correlation matrix
    corr_matrix = corr_matrix.mask(mask)

    # Create the heatmap with tooltips
    fig = px.imshow(corr_matrix,
                    text_auto=True,
                    aspect="auto",
                    labels=dict(color="Correlation"),
                    color_continuous_scale='Blues',  # Blue gradient
                    zmin=-1, zmax=1)

    # Update layout for better readability
    fig.update_layout(title='Correlation Matrix',
                      xaxis_title='Features',
                      yaxis_title='Features')

    # Show the plot
    fig.show()





"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
To remove the redundant squares and only show the lower triangle of the correlation matrix, 
you can use the mask to hide the upper triangle and set the diagonal to NaN to avoid showing
 the correlation of variables with themselves. Here’s the updated function:
'''
import plotly.express as px
import pandas as pd
import numpy as np

def plot_correlation_matrix4(df):
    # Calculate the correlation matrix
    corr_matrix = df.corr()

    # Generate a mask for the upper triangle
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))

    # Apply the mask to the correlation matrix and set the diagonal to NaN
    corr_matrix = corr_matrix.mask(mask)
    np.fill_diagonal(corr_matrix.values, np.nan)

    # Remove redundant squares by setting the upper triangle to NaN
    corr_matrix = corr_matrix.where(~mask)

    # Create the heatmap with tooltips
    fig = px.imshow(corr_matrix,
                    text_auto=True,
                    aspect="auto",
                    labels=dict(color="Correlation"),
                    color_continuous_scale='Blues',  # Blue gradient
                    zmin=-1, zmax=1)

    # Update layout for better readability
    fig.update_layout(title='Correlation Matrix',
                      xaxis_title='Features',
                      yaxis_title='Features')

    # Show the plot
    fig.show()






"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
Both Spearman and Pearson correlations are used to measure the strength and direction of the relationship between two variables, but they differ in their approach and the type of data they handle.

Pearson Correlation
Type of Data: It measures the linear relationship between two continuous variables.
Assumptions: Assumes that the data is normally distributed and the relationship between the variables is linear.
Calculation: Uses the actual data values.
Sensitivity: Sensitive to outliers, which can significantly affect the correlation coefficient.
Spearman Correlation
Type of Data: It measures the monotonic relationship between two variables, which can be ordinal, interval, or ratio.
Assumptions: Does not assume a normal distribution and can handle non-linear relationships.
Calculation: Uses the rank of the data values rather than the actual data values.
Sensitivity: Less sensitive to outliers compared to Pearson correlation.
In summary, use Pearson correlation when you expect a linear relationship and your data is normally distributed. Opt for Spearman correlation when dealing with ordinal data or when the relationship is not necessarily linear1
'''
import plotly.express as px
import pandas as pd
import numpy as np

def plot_correlation_matrix(df, method='pearson'):
    """
    Plots a correlation matrix with an option to choose between Pearson and Spearman correlations.

    Parameters:
    df (pd.DataFrame): The input dataframe.
    method (str): The correlation method, either 'pearson' or 'spearman'. Default is 'pearson'.
    """
    # Calculate the correlation matrix
    corr_matrix = df.corr(method=method)

    # Generate a mask for the upper triangle
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))

    # Apply the mask to the correlation matrix and set the diagonal to NaN
    corr_matrix = corr_matrix.mask(mask)
    np.fill_diagonal(corr_matrix.values, np.nan)

    # Remove redundant squares by setting the upper triangle to NaN
    corr_matrix = corr_matrix.where(~mask)

    # Create the heatmap with tooltips
    fig = px.imshow(corr_matrix,
                    text_auto=True,
                    aspect="auto",
                    labels=dict(color="Correlation"),
                    color_continuous_scale='Blues',  # Blue gradient
                    zmin=-1, zmax=1)

    # Update layout for better readability
    fig.update_layout(title=f'Correlation Matrix ({method.capitalize()} Correlation)',
                      xaxis_title='Features',
                      yaxis_title='Features')

    # Show the plot
    fig.show()










"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
Explanation:
title: The title of the plot.
x_label: The label for the x-axis.
y_label: The label for the y-axis.
theme: The theme for the plot (e.g., ‘plotly’, ‘ggplot2’, ‘seaborn’, etc.).
Additional Customizations:
Marker Style: You can customize the marker style using fig.update_traces(marker=dict(...)).
Legend: Customize the legend using fig.update_layout(legend=dict(...)).
Annotations: Add annotations using fig.add_annotation(...).
Here’s an example of adding marker style and annotations:



In this example:

df is the DataFrame containing the data.
x_var is set to ‘GDP’.
y_var is set to ‘Life Expectancy’.
color_var is set to ‘Country’.
size_var is set to ‘Population’.
hover_data includes ‘Country’.
title is ‘GDP vs Life Expectancy’.
x_label is ‘GDP (in billions)’.
y_label is ‘Life Expectancy (years)’.
theme is ‘plotly’.
This will create a scatter plot with GDP on the x-axis, Life Expectancy on the y-axis, different colors for each country, and bubble sizes representing the population. Let me know if you need any further adjustme

'''
import plotly.express as px

def create_custom_scatter_plot(df, x_var, y_var, color_var, size_var, hover_data, title, x_label, y_label, theme='plotly'):
    fig = px.scatter(df, x=x_var, y=y_var, color=color_var, size=size_var, hover_data=hover_data)

    # Customizing the plot
    fig.update_layout(
        title=title,
        xaxis_title=x_label,
        yaxis_title=y_label,
        template=theme
    )

    fig.show()













"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
STEP 2:

Sure! Here’s a simple function using Plotly in Python to create a scatter plot with a legend:


This function takes a DataFrame and column names for the x-axis, y-axis, and color grouping, and creates a scatter plot with a legend. You can customize the data and column names as needed.

Let me know if you need any further customization or have any questions!
'''

import plotly.express as px
import pandas as pd

def create_scatter_plot_with_legend(data, x_col, y_col, color_col, title):
    """
    Creates a scatter plot with a legend using Plotly.

    Parameters:
    - data: DataFrame containing the data
    - x_col: Column name for the x-axis
    - y_col: Column name for the y-axis
    - color_col: Column name for the color grouping (legend)
    - title: Title of the scatter plot

    Returns:
    - fig: Plotly figure object
    """
    fig = px.scatter(data, x=x_col, y=y_col, color=color_col, title=title)
    fig.update_layout(legend_title_text=color_col)
    fig.show()


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
Got it! To suppress the warning about the n_init parameter, you can explicitly set its value in the KMeans initialization. Here’s the updated function:


In this updated function, I’ve added the n_init parameter with a default value of 10. You can adjust this value as needed to fit your specific requirements.

If you have any more questions or need further assistance, feel free to ask!

Column SDOH1_Physically_Mentally_Unhealthy: float64
Column SDOH3_Unemployment_Rate: float64
Column SDOH2_Education1: float64
Column SDOH4_Median_Household_Income: float64

'''
import pandas as pd
from sklearn.cluster import KMeans

def kmeans_clustering(df, columns, n_clusters, n_init=10):
    """
    Perform K-means clustering on specified columns of a DataFrame.

    Parameters:
    df (pd.DataFrame): The input DataFrame.
    columns (list): List of column names to use for clustering.
    n_clusters (int): The number of clusters to form.
    n_init (int): Number of time the k-means algorithm will be run with different centroid seeds.

    Returns:
    pd.DataFrame: DataFrame with an additional column 'cluster' indicating the cluster each row belongs to.
    """
    # Extract the specified columns
    data = df[columns]

    # Initialize the KMeans model with explicit n_init
    kmeans = KMeans(n_clusters=n_clusters, n_init=n_init, random_state=42)

    # Fit the model and predict clusters
    df['cluster'] = kmeans.fit_predict(data)

    return df







"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''

write a python function using plotly to produce a parallel coordinate plot using a dataset as input and use the iris dataset as an example


Sure! Here’s a Python function that uses Plotly to create a parallel coordinate plot. This function takes a dataset as input and generates the plot. I’ll use the Iris dataset as an example.


his function will create a parallel coordinates plot with the Iris dataset, coloring the lines based on the species. You can customize the color_column and dimensions parameters to fit your specific dataset and requirements.

Feel free to try it out and let me know if you have any questions!
'''

import plotly.express as px

def create_parallel_coordinates_plot(data, color_column, dimensions):
    """
    Creates a parallel coordinates plot using Plotly.

    Parameters:
    data (DataFrame): The dataset to plot.
    color_column (str): The column name to use for coloring the lines.
    dimensions (list): The list of column names to use as dimensions.

    Returns:
    fig: The Plotly figure object.
    """
    fig = px.parallel_coordinates(
        data,
        color=color_column,
        dimensions=dimensions,
        labels={col: col.replace('_', ' ').title() for col in dimensions},
        color_continuous_scale=px.colors.diverging.Tealrose,
        color_continuous_midpoint=2
    )
    fig.show()
    return fig









"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""

import plotly.express as px
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def create_radar_chart(df, columns, dimension):
    # Normalize the selected columns
    scaler = MinMaxScaler()
    df[columns] = scaler.fit_transform(df[columns])

    # Melt the dataframe to long format
    df_melted = df.melt(id_vars=[dimension], value_vars=columns, var_name='feature', value_name='value')

    # Create the radar chart
    fig = px.line_polar(df_melted, r='value', theta='feature', color=dimension, line_close=True, title='Radar Chart')
    fig.update_traces(fill='toself', hovertemplate='Feature: %{theta}<br>Value: %{r}<br>Dimension: %{color}')

    # Add ticks on all the lines
    fig.update_layout(polar=dict(
        radialaxis=dict(tickmode='linear', tick0=0, dtick=0.1)
    ))

    # Show the chart
    fig.show()






"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''
write a python function to provide a sentiment score on a column in a dataframe using NLTK


Sure! Here’s a Python function that uses NLTK’s VADER (Valence Aware Dictionary and sEntiment Reasoner) to provide sentiment scores for a column in a DataFrame. This function will add new columns for the sentiment scores (positive, negative, neutral, and compound) to the DataFrame.

First, make sure you have the necessary libraries installed:



This function takes a DataFrame df and the name of the column containing the text data (column). It adds four new columns to the DataFrame: positive, negative, neutral, and compound, which contain the respective sentiment scores for each text entry12.

'''

import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

# Download the VADER lexicon
nltk.download('vader_lexicon')

def add_sentiment_scores(df, column):
    # Initialize the VADER sentiment analyzer
    sia = SentimentIntensityAnalyzer()

    # Apply the sentiment analysis
    df['positive'] = df[column].apply(lambda x: sia.polarity_scores(x)['pos'])
    df['negative'] = df[column].apply(lambda x: sia.polarity_scores(x)['neg'])
    df['neutral'] = df[column].apply(lambda x: sia.polarity_scores(x)['neu'])
    df['compound'] = df[column].apply(lambda x: sia.polarity_scores(x)['compound'])

    return df







"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""
'''

Sent by Copilot:
Sure! You can use the plotly library to create a choropleth map of the US with states colored based on a numeric variable. Here’s a function to help you get started:

Python


Routine programming code snippets. Review and use carefully. More info on FAQ.
In this example, data is a DataFrame containing the state abbreviations and the numeric variable you want to plot. The plot_us_state_map function uses Plotly Express to create a choropleth map, coloring the states based on the values in the specified column.

Feel free to customize the colormap and other parameters to suit your needs! If you have any specific requirements or questions, let me know.
'''
import plotly.express as px
import pandas as pd

def plot_us_state_map(data, column, title='US States Map', color_continuous_scale='Viridis'):
    """
    Plots a US state map with states colored based on a numeric variable.

    Parameters:
    - data: DataFrame containing the state data with a column for the numeric variable.
    - column: The name of the column in the DataFrame containing the numeric variable.
    - title: The title of the map.
    - color_continuous_scale: The colormap to use for coloring the states.
    """
    fig = px.choropleth(
        data_frame=data,
        locationmode='USA-states',
        locations='state',
        scope='usa',
        color=column,
        hover_name='state',
        color_continuous_scale=color_continuous_scale,
        labels={column: column}
    )
    fig.update_layout(
        title_text=title,
        geo=dict(
            lakecolor='rgb(255, 255, 255)'
        )
    )
    fig.show()

# Example usage
# Sample data
#data = pd.DataFrame({
#    'state': ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA'],
#    'value': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
#})







"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""


"""
    NAME: TBD
    PURPOSE: TBD.

    INPUT PARAMETERS:
    TBD
 
    OUTPUT/RETURNS:
    TBD
"""








