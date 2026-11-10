# -*- coding: utf-8 -*-
"""
Created on Sat Jan 25 13:07:16 2025

USing Github Copilot

@author: david
"""

import pandas as pd
import pulp

# Load data
combinations = pd.read_csv('combinations.csv')
doctor_revenue_target = pd.read_csv('doctor_revenue_target.csv')
doctors_hours = pd.read_csv('doctors_hours.csv')

# Initialize the problem
problem = pulp.LpProblem("Maximize_Revenue", pulp.LpMaximize)

# Define decision variables
x = pulp.LpVariable.dicts("Event", combinations.ID, lowBound=0, cat='Integer')

# Objective function
problem += pulp.lpSum([x[i] * combinations.loc[i-1, 'Procedure Revenue'] for i in combinations.ID]), "Total_Revenue"

# Constraints for doctors' hours
doctor_hours = doctors_hours.set_index('Doctor')['Doctor Hours avail'].to_dict()
for doctor in doctor_hours:
    problem += pulp.lpSum([x[i] * combinations.loc[i-1, 'Duration'] for i in combinations.ID if combinations.loc[i-1, 'Doctor'] == doctor]) <= doctor_hours[doctor], f"{doctor}_hours_constraint"

# Constraints for theatres' hours
for theatre in ['Theatre 1', 'Theatre 2']:
    problem += pulp.lpSum([x[i] * combinations.loc[i-1, 'Duration'] for i in combinations.ID if combinations.loc[i-1, 'Theatre'] == theatre]) <= 55, f"{theatre}_hours_constraint"

# Solve the problem
problem.solve()

# Print the results
print("Status:", pulp.LpStatus[problem.status])
print("Total Revenue:", pulp.value(problem.objective))
for i in combinations.ID:
    if x[i].varValue > 0:
        print(f"Event {i}: {x[i].varValue} times")

# Summarize the results in a dataframe
results = pd.DataFrame({
    'ID': combinations.ID,
    'Doctor': combinations.Doctor,
    'Procedure': combinations.Procedure,
    'Theatre': combinations.Theatre,
    'Duration': combinations.Duration,
    'Procedure Revenue': combinations['Procedure Revenue'],
    'Scheduled Times': [x[i].varValue for i in combinations.ID]
})

print(results[results['Scheduled Times'] > 0])