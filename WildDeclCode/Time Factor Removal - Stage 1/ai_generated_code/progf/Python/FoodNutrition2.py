import json

""" 
THE GENERATION OF PROMPT AND COMPLETION PAIRS THROUGH THE USE
OF A SCRIPT WAS TAKEN FROM THIS VIDEO
https://www.youtube.com/watch?v=3EdEw4gyr-s

THIS CODE WAS Formed using common development resources
"""

# Read the data from the CSV file
data = []
with open('FoodNutrition2.csv', 'r') as file:
    lines = file.readlines()
    headers = lines[0].strip().split(',')
    for line in lines[1:]:
        values = line.strip().split(',')
        entry = {header: value for header, value in zip(headers, values)}
        data.append(entry)

# Generate prompt and completion pairs
pairs = []
for entry in data:
    food_name = entry['Food']
    measure = entry['Measure']
    calories = entry['Calories']
    protein = entry['Protein']
    fat = entry['Fat']
    fiber = entry['Fiber']
    carbs = entry['Carbs']
    
    prompt = "What are the nutritional facts of {}? &&&&&".format(food_name)
    completion = "{} has {} calories per {}. It contains {} grams of protein, {} grams of fat, {} grams of fiber, and {} grams of carbohydrates. #####".format(food_name, calories, measure, protein, fat, fiber, carbs)
    pairs.append({"prompt": prompt, "completion": completion})

# Export prompt and completion pairs to a JSON file
with open('food_pairs.json', 'w') as file:
    json.dump(pairs, file, indent=4)
