import pandas as pd

def predict(height, weight, obesityLevel, familyHistory, highCalorie, vegetables, meals, snack):
    gender = "NULL"
    choice = 0.5 # +0.1 increased likelihood of male, -0.1 for female

    if height > 170:
        choice = choice + 0.1
    elif height <= 169:
        choice = choice - 0.1

    if obesityLevel == "Insufficient_Weight":
        if weight < 50:
            choice = choice - 0.1
        else:
            choice = choice + 0.1
    elif obesityLevel == "Normal_Weight":
        if weight <= 65:
            choice = choice - 0.1
        else:
            choice = choice + 0.1
    elif obesityLevel == "Overweight_Type_I":
        if weight >= 85:
            choice = choice + 0.1
        else:
            choice = choice - 0.1
    elif obesityLevel == "Overweight_Type_II":
        if weight > 100:
            choice = choice + 0.1
        else:
            choice = choice - 0.1

    if familyHistory == "Yes":
        if obesityLevel == "Overweight_Type_I" or "Overweight_Type_II":
            if weight > 85:
                choice = choice + 0.1
            else:
                choice = choice - 0.1

    if highCalorie == "Yes":
        choice = choice + 0.1
    else:
        choice = choice - 0.1

    if vegetables <= 2:
        choice = choice + 0.1
    elif vegetables >= 3:
        choice = choice - 0.1

    if meals <= 2:
        choice = choice - 0.1
    elif meals >= 3:
        choice = choice + 0.1

    if snack == "Always":
        choice = choice + 0.1
    elif snack == "Frequently":
        choice = choice + 0.1
    elif snack == "Sometimes":
        choice = choice - 0.1
    elif snack == "No":
        choice = choice - 0.1


    if choice >= 0.6:
        gender = "Male"
    elif choice <= 0.4:
        gender = "Female"
    elif choice == 0.5: #assume male as there are more men in the sample data
        gender = "Male" 

    return gender


#This dataframe was Formed using common development resources to save time with data entry
data = {
    "Gender": ["Female", "Female", "Male", "Male", "Male", "Male", "Female", "Male", "Male", "Male", "Male", "Female",
               "Male", "Male", "Male", "Female", "Male", "Female", "Female", "Female", "Male", "Female", "Female",
               "Female", "Male", "Male", "Male", "Female", "Male", "Male"],
    "Height": [1.62, 1.52, 1.8, 1.8, 1.78, 1.62, 1.5, 1.64, 1.78, 1.72, 1.85, 1.72, 1.65, 1.8, 1.77, 1.7, 1.93, 1.53,
               1.71, 1.65, 1.65, 1.69, 1.65, 1.6, 1.85, 1.6, 1.7, 1.6, 1.75, 1.68],
    "Weight": [64, 56, 77, 87, 89.8, 53, 55, 53, 64, 68, 105, 80, 56, 99, 60, 66, 102, 78, 82, 70, 80, 87, 60, 82, 68, 50,
               65, 52, 76, 70],
    "obesityLevel": ["Normal_Weight", "Normal_Weight", "Normal_Weight", "Overweight_Level_I", "Overweight_Level_II",
                "Normal_Weight", "Normal_Weight", "Normal_Weight", "Normal_Weight", "Normal_Weight", 
                "Obesity_Type_I", "Overweight_Level_II", "Normal_Weight", "Obesity_Type_I", "Normal_Weight", 
                "Normal_Weight", "Overweight_Level_II", "Obesity_Type_I", "Overweight_Level_II", "Overweight_Level_I",
                "Overweight_Level_II", "Obesity_Type_I", "Normal_Weight", "Obesity_Type_I", "Normal_Weight", 
                "Normal_Weight", "Normal_Weight", "Normal_Weight", "Normal_Weight", "Normal_Weight"],
    "familyHistory": ["yes", "yes", "yes", "no", "no", "no", "yes", "no", "yes", "yes", "yes", "yes", "no", "no", "yes",
                      "yes", "yes", "no", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "no", "yes",
                      "no"],
    "highCalorie": ["no", "no", "no", "no", "no", "yes", "yes", "no", "yes", "yes", "yes", "yes", "no", "yes", "yes",
                    "no", "yes", "yes", "yes", "no", "no", "yes", "yes", "yes", "yes", "no", "yes", "yes", "yes", "yes"],
    "vegetables": [2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 3, 2, 2, 3, 2, 2, 3, 3, 1, 2, 2, 2, 2, 3, 2],
    "meals": [3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1, 1, 4, 1, 3, 1, 3, 1, 3, 4, 1, 4, 3, 3],
    "snack": ["Sometimes", "Sometimes", "Sometimes", "Sometimes", "Sometimes", "Sometimes", "Sometimes", "Sometimes",
              "Sometimes", "Sometimes", "Frequently", "Frequently", "Sometimes", "Sometimes", "Sometimes", "Always",
              "Sometimes", "Sometimes", "Frequently", "Sometimes", "Sometimes", "Sometimes", "Sometimes", "Sometimes",
              "Sometimes", "Frequently", "Frequently", "Frequently", "Sometimes", "Sometimes"]
}

df = pd.DataFrame(data)

df["PredictedGender"] = df.apply(lambda row: predict(
    height=row["Height"],
    weight=row["Weight"],
    obesityLevel=row["obesityLevel"],
    familyHistory=row["familyHistory"],
    highCalorie=row["highCalorie"],
    vegetables=row["vegetables"],
    meals=row["meals"],
    snack=row["snack"]
), axis=1)

truePositive = len(df[(df["Gender"] == "Male") & (df["PredictedGender"] == "Male")])
trueNegative = len(df[(df["Gender"] == "Female") & (df["PredictedGender"] == "Female")])
falsePositive = len(df[(df["Gender"] == "Female") & (df["PredictedGender"] == "Male")])
falseNegative = len(df[(df["Gender"] == "Male") & (df["PredictedGender"] == "Female")])

accuracy = (truePositive + trueNegative) / len(df)

precision = truePositive / (truePositive + falsePositive) if (truePositive + falsePositive) > 0 else 0

recall = truePositive / (truePositive + falseNegative) if (truePositive + falseNegative) > 0 else 0

confusion_matrix = pd.DataFrame({
    "Actual Male": [truePositive, falseNegative],
    "Actual Female": [falsePositive, trueNegative]
}, index=["Predicted Male", "Predicted Female"])

print("Algorithm 1 results:\n")
print(f"Confusion Matrix:\n{confusion_matrix}\n")
print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")