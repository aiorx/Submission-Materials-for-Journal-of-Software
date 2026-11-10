# Supported via standard GitHub programming aids 2024.12.09

import csv
from datetime import datetime, timedelta

def analyze_csv(file_path):
    with open(file_path, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=';')
        headers = next(reader)
        headers.extend([f'Tag-{i+1}' for i in range(20)])  # Adjust the range if more tags are needed

        rows = []
        for row in reader:
            tags = []
            filled_cells = [cell for cell in row if cell]
            filled_count = len(filled_cells)

            if filled_count % 2 == 0:
                tags.append("complete")
            else:
                tags.append("open")

            kommen_index = headers.index('kommen1')
            first_kommen = row[kommen_index]
            last_filled = filled_cells[-1]

            if first_kommen and last_filled:
                try:
                    first_kommen_time = datetime.strptime(first_kommen, '%H:%M:%S')
                    last_filled_time = datetime.strptime(last_filled, '%H:%M:%S')
                    if last_filled_time - first_kommen_time > timedelta(hours=7, minutes=48):
                        tags.append("Überstunde")
                except ValueError:
                    pass

            for i in range(kommen_index, len(headers) - 1, 2):
                if headers[i].startswith('kommen') and headers[i + 1].startswith('gehen'):
                    try:
                        kommen_time = datetime.strptime(row[i], '%H:%M:%S')
                        gehen_time = datetime.strptime(row[i + 1], '%H:%M:%S')
                        if gehen_time - kommen_time > timedelta(hours=6):
                            tags.append("pausenlos")
                    except ValueError:
                        pass

            row.extend(tags)
            rows.append(row)

    with open('Zeiterfassungen_ausgewertet.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=';')
        writer.writerow(headers)
        writer.writerows(rows)

if __name__ == "__main__":
    analyze_csv('Zeiterfassungen.csv')
