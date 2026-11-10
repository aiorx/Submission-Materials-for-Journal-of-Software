"""
TODO

The majority of this script was Penned via standard programming aids3.5

    $ python -m code.plot_data_and_predictions \
            --predictions 79.68103,78.69210,92.82679 \
            --plot_subtitle "(Language Model's Predictions)" \
            --output_filename llm_predictions.png
"""

import argparse
import csv
import matplotlib.pyplot as plt

parser = argparse.ArgumentParser()
parser.add_argument(
    "-p",
    "--predictions",
    help="Predictions for the last 3 months in the dataset (as a comma-separated string of floats)",
    type=str,
    required=True,
)
parser.add_argument(
    "-s",
    "--plot_subtitle",
    help="Subtitle to add to exported plot",
    type=str,
    required=True,
)
parser.add_argument(
    "-o",
    "--output_filename",
    help="Name of file to export plot to",
    type=str,
    required=True,
)
args = parser.parse_args()


# Read data from CSV file
def read_csv(file_path):
    data = []
    with open(file_path, "r", newline="") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip header
        for row in reader:
            data.append((row[0], float(row[1])))
    return data


# Function to plot data
def plot_data(data):
    years = {}
    for year_month, sales in data:
        year = year_month[:4]
        if year in years:
            years[year].append(sales)
        else:
            years[year] = [sales]
    plt.figure(figsize=(10, 6))
    for year, sales_data in years.items():
        plt.plot(range(1, len(sales_data) + 1), sales_data, label=year)
    plt.plot(
        (9, 10, 11, 12),
        [years["2027"][-1]] + [float(x) for x in args.predictions.split(",")],
        label="2027 predicted",
        linestyle="dashed",
    )
    plt.xlabel("Month")
    plt.ylabel("Sales (m)")
    plt.suptitle("Monthly Sales Over Years")
    plt.title(args.plot_subtitle)
    plt.xticks(
        range(1, 13),
        [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
    )
    plt.legend()
    plt.tight_layout()
    plt.savefig(f"./assets/{args.output_filename}", dpi=100)
    plt.show()


if __name__ == "__main__":
    file_path = "./assets/simdata.csv"
    data = read_csv("./assets/simdata.csv")
    plot_data(data)
