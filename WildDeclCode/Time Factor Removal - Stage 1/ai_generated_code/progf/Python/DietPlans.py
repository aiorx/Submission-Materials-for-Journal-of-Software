import json

""" 
THE GENERATION OF PROMPT AND COMPLETION PAIRS THROUGH THE USE
OF A SCRIPT WAS TAKEN FROM THIS VIDEO
https://www.youtube.com/watch?v=3EdEw4gyr-s

THIS CODE WAS Designed via basic programming aids
"""

# Read the data from the CSV file
data = []
with open('DietPlans.csv', 'r', encoding="utf-8") as file:
    lines = file.readlines()
    headers = lines[0].strip().split(',')
    for line in lines[1:]:
        values = line.strip().split(',')
        entry = {header: value for header, value in zip(headers, values)}
        data.append(entry)

# Generate prompt and completion pairs
pairs = []
for entry in data:
    diet_type = entry['Diet_type']
    recipe_name = entry['Recipe_name']
    cuisine_type = entry['Cuisine_type']
    protein = entry['Protein(g)']
    carbs = entry['Carbs(g)']
    fat = entry['Fat(g)']
    
    prompt = "Can you suggest a {} recipe?".format(diet_type)
    completion = "Sure! How about trying the {} recipe? It is a {} dish that contains {} grams of protein, {} grams of carbohydrates, and {} grams of fat.".format(recipe_name, cuisine_type, protein, carbs, fat)
    pairs.append({"prompt": prompt, "completion": completion})

# Export prompt and completion pairs to a JSON file
with open('recipe_pairs.json', 'w') as file:
    json.dump(pairs, file, indent=4)
