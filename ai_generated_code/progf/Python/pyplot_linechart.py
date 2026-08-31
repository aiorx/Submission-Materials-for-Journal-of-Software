import requests
import pandas as pd
import numpy
import json
import time
import datetime
import os.path
import math
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib
import matplotlib.dates as mdates

def read_txt_addjsonBracket(filename):
    with open(filename, encoding='utf-8') as data_file:
        text="["+data_file.read()
        text = text[:-2]+"]"
        data = json.loads(text)
    return data

def read_json(filename):
    with open(filename, encoding='utf-8') as data_file:
        data = json.load(data_file)
    return data


def json_to_df(filename):
    data = read_json(filename)
    df = pd.DataFrame(data)
    return df

def json_to_df_stock_id(filename):
    data = read_json(filename)
    df = pd.DataFrame(data)
    df['stock_id'] = df['stock_id'].astype(str)
    array = df['stock_id'].values
    return array

Top200stock =json_to_df_stock_id("市值top200_20220501.json")

#stockID = "1101"

for stockID in Top200stock:
    fname = "FinancialStatements\\"+stockID + '_FinancialStatements_raw' +'.txt'
    data = read_txt_addjsonBracket(fname)
    df = pd.DataFrame(data)
    #print(df)

    # Drafted using common development resources
    # Group the data by the "type" column
    grouped_df = df.groupby('type')
    rowlength = int(grouped_df.ngroups/4) 

    
    for i, (name, group) in enumerate(grouped_df):
        if name == "GrossProfit":
            print(name)
            sum_of_values = sum( group['value'])
            length_of_group = len(list(group['value']))
            average = sum_of_values / length_of_group

            #count scientific notation divisor (string) turn to int
            power = int(math.log10(average))
            #ound a value to the nearest multiple of 3
            rounded_power = (power // 3) * 3        
            #get the y axis interval modify in the power 3,6,9...
            divisor_sci = float("{:.0e}".format(math.pow(10, rounded_power)))

            print(divisor_sci)

            fig, ax = plt.subplots(figsize=(12, 6))
            ax.plot(group['date'], [v/divisor_sci for v in group['value']], label=name) 
            plt.ticklabel_format(style='plain', axis='y')
            plt.xticks(rotation=30)

            yLabel = ""
            unit =""
            # Add labels and title
            if rounded_power == 3:
                yLabel = "Revenue (in 1000 of NT$)"
                unit = "M"
            elif rounded_power == 6:
                yLabel = "Revenue (in millions of NT$)"
                unit = "MM"
            elif rounded_power == 9:
                yLabel = "Revenue (in billions of NT$)"
                unit = "B"
            title = "stock " +stockID+ " Revenue"

            ax.set_xlabel("Date")
            ax.set_ylabel(yLabel)
            ax.set_title(title)


            index_locator = ticker.IndexLocator(base=1, offset=0)
            ax.xaxis.set_major_locator(index_locator)
            # Format the x-axis as months
            #ax.xaxis.set_major_locator(mdates.MonthLocator(interval=1))
            #ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))

            # Add a grid and legend
            ax.grid(True, linestyle='--')
            ax.legend(loc="upper left")

            # Add annotations for maximum and minimum values
            max_index = group['value'].values.argmax()
            min_index = group['value'].values.argmin()
            y_annotation_offset = -0.2
            ax.annotate(("Max: {:.2f}"+unit).format(max(group['value'])/divisor_sci), xy=(max_index, max(group['value'])//divisor_sci+y_annotation_offset) )
            ax.annotate(("Min: {:.2f}"+unit).format(min(group['value'])/divisor_sci), xy=(min_index, min(group['value'])//divisor_sci+y_annotation_offset) )

            #plt.show()
            # Save the chart to a file
            outputname ="pic\\FinancialStatements\\"+stockID + '_revenue' +'.png'
            #plt.savefig("outputname.png")
            plt.savefig(outputname)


# Create a figure with a subplot for each group
#fig, axs = plt.subplots(nrows=len(grouped_df), sharex=True)
#fig, axs = plt.subplots(nrows=4, ncols=rowlength, sharex=True)

# Iterate through each group and plot the data in a subplot
# for i, (name, group) in enumerate(grouped_df):
#     axs[i].plot(group['date'], group['value'], label=name)
#     axs.get_yaxis().set_major_formatter( matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))
#     axs[i].legend()


# Iterate through each group and plot the data in a subplot
# for i, (name, group) in enumerate(grouped_df):
#     axs[i // 4][i % 4].plot(group['date'], group['value'], label=name)
#     axs[i // 4][i % 4].ticklabel_format(style='plain',axis='y')
#     axs[i // 4][i % 4].tick_params(axis='both', which='major', labelsize=6)
#     axs[i // 4][i % 4].tick_params(axis='both', which='minor', labelsize=4)
#     axs[i // 4][i % 4].get_yaxis().set_major_formatter( matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))
#     axs[i // 4][i % 4].get_xaxis().set_tick_params(rotation=30)
#     axs[i // 4][i % 4].legend()


# Show the plots
#plt.show()


#credit to chatGPT

# df.plot(x='date',y='value')
# df.set_index('date', inplace=True)
# df.groupby('type')['value'].plot(legend=True)
# 


# grouped = df.groupby(['type'])
# rowlength = int(grouped.ngroups/2)                         # fix up if odd number of groups
# fig, axs = plt.subplots(figsize=(9,4), 
                        # nrows=2, ncols=rowlength,     # fix as above
                        # gridspec_kw=dict(hspace=0.4)) # Much control of gridspec
# 
# targets = zip(grouped.groups.keys(), axs.flatten())
# 
# for i, (key, ax) in enumerate(targets):
    # ax.plot(x='date',y='value')
    # ax.get_yaxis().set_major_formatter( matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))
# 
# ax.legend()


#fig, ax = plt.subplots()



# for key, grp in df.groupby(['type']):
    # ax.plot(grp['date'], grp['value'], label=key)
    # ax.get_yaxis().set_major_formatter( matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))
# 
# ax.legend()
#plt.ticklabel_format(style='plain',axis='y')


# for stockID in Top200stock:
    # fname = stockID + '_MonthRevenue_raw' +'.txt'
    # if os.path.isfile(fname) :
        # print(stockID)
#    
#    




