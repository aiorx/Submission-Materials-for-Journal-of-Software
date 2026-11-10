import pandas as pd
from catboost import CatBoostClassifier
from imblearn.over_sampling import SMOTE, SMOTENC
from imblearn.under_sampling import RandomUnderSampler
from sklearn.metrics import classification_report

#load in data
X_train = pd.read_csv('X_train.csv')
y1_train = pd.read_csv('y1_train.csv')
pre_y2_train = pd.read_csv('y2_train.csv')

X_dev = pd.read_csv('X_dev.csv')
y1_dev = pd.read_csv('y1_dev.csv')
y2_dev = pd.read_csv('y2_dev.csv')

X_test = pd.read_csv('test_set_unlabeled.csv', header=None)
testing_headers = ['id', 'skills', 'exp', 'grades', 'projects', 'extra', 'offer']
X_test.columns = testing_headers

smote = SMOTENC(categorical_features=['skills'], sampling_strategy={'Yes': 100}, random_state=42)
smote_X_train, smote_y_train = smote.fit_resample(X_train, y1_train)


#Make a X2_train as a sub-dataframe of X_train consisting of only models where y1 is Yes
X2_train = X_train[y1_train['hire'] == 'Yes'].reset_index(drop=True)
y2_train = pre_y2_train[y1_train['hire'] == 'Yes'].reset_index(drop=True)
#Initialize Model
model1 = CatBoostClassifier(iterations=100, learning_rate=0.3, depth=3, cat_features=['skills'], verbose=True)
model2 = CatBoostClassifier(iterations=100, learning_rate=0.1, depth=5, cat_features=['skills'], verbose=True)

#Train models
model1.fit(X_train.drop('id', axis=1), y1_train)
model2.fit(X2_train.drop('id', axis=1), y2_train)

#get y1 dev predictions
model1_preds = model1.predict(X_dev.drop('id', axis=1))
model1_pred_frame = pd.DataFrame({"predictions": model1_preds.ravel()})

#Function for .apply
def check_for_model2(row):
    prediction = None
    if row['predictions'] == 'Yes':
        input_row = row.drop(['predictions']).to_frame().T
        prediction = model2.predict(input_row)[0]
    else:
        prediction = "NoPay"
    return prediction

#do above .apply
dev2_combine = (pd.concat([X_dev.drop('id', axis=1).reset_index(drop=True),
                           model1_pred_frame.reset_index(drop=True)], axis=1))
model2_preds = dev2_combine.apply(check_for_model2, axis=1)

#display dev results
print("report for hire")
print(classification_report(y1_dev, model1_preds))
print("report for pay")
print(classification_report(y2_dev.reset_index(drop=True), model2_preds))

#get test predictions
model1_test_preds = model1.predict(X_test.drop('id', axis=1))
model1_test_pred_frame = pd.DataFrame({"predictions": model1_test_preds.ravel()})

#do above .apply
test2_combine = (pd.concat([X_test.drop('id', axis=1).reset_index(drop=True),
                           model1_test_pred_frame.reset_index(drop=True)], axis=1))
model2_test_preds = test2_combine.apply(check_for_model2, axis=1)

#write test predictions to txt(Composed with basic coding tools)
model2_test_preds = pd.Series(model2_test_preds).reset_index(drop=True)
test_predictions = pd.concat([pd.Series(model1_test_preds.ravel()).reset_index(drop=True), model2_test_preds], axis=1)
test_predictions.to_csv("preds.txt", header=False, index=False)