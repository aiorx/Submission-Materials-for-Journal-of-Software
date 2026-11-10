```python
def getCalorie(label, volume): #volume in cm^3
	'''
	Inputs are the volume of the foot item and the label of the food item
	so that the food item can be identified uniquely.
	The calorie content in the given volume of the food item is calculated.
	'''
	calorie = calorie_dict[int(label)]
	if (volume == None):
		return None, None, calorie
	density = density_dict[int(label)]
	mass = volume*density*1.0
	calorie_tot = (calorie/100.0)*mass
	return mass, calorie_tot, calorie #calorie per 100 grams
```