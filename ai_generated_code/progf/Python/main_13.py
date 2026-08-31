#Formed using common GitHub development resources
import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score

# 加载示例数据集
iris = datasets.load_iris()
X = iris.data
y = iris.target

# 将数据集分为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 标准化特征
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 1. 线性回归
linear_model = LinearRegression()
linear_model.fit(X_train, y_train)
linear_pred = linear_model.predict(X_test)
print("线性回归预测:", linear_pred)

# 2. 逻辑回归
logistic_model = LogisticRegression(max_iter=200)
logistic_model.fit(X_train, y_train)
logistic_pred = logistic_model.predict(X_test)
print("逻辑回归准确率:", accuracy_score(y_test, logistic_pred))

# 3. 决策树
tree_model = DecisionTreeClassifier()
tree_model.fit(X_train, y_train)
tree_pred = tree_model.predict(X_test)
print("决策树准确率:", accuracy_score(y_test, tree_pred))

# 4. 随机森林
forest_model = RandomForestClassifier()
forest_model.fit(X_train, y_train)
forest_pred = forest_model.predict(X_test)
print("随机森林准确率:", accuracy_score(y_test, forest_pred))

# 5. 支持向量机
svm_model = SVC()
svm_model.fit(X_train, y_train)
svm_pred = svm_model.predict(X_test)
print("支持向量机准确率:", accuracy_score(y_test, svm_pred))

# 6. K 近邻
knn_model = KNeighborsClassifier()
knn_model.fit(X_train, y_train)
knn_pred = knn_model.predict(X_test)
print("K 近邻准确率:", accuracy_score(y_test, knn_pred))

# 7. 朴素贝叶斯
nb_model = GaussianNB()
nb_model.fit(X_train, y_train)
nb_pred = nb_model.predict(X_test)
print("朴素贝叶斯准确率:", accuracy_score(y_test, nb_pred))

# 8. 梯度提升
gb_model = GradientBoostingClassifier()
gb_model.fit(X_train, y_train)
gb_pred = gb_model.predict(X_test)
print("梯度提升准确率:", accuracy_score(y_test, gb_pred))

# 9. 神经网络 (使用 MLPClassifier)
from sklearn.neural_network import MLPClassifier
nn_model = MLPClassifier(max_iter=300)
nn_model.fit(X_train, y_train)
nn_pred = nn_model.predict(X_test)
print("神经网络准确率:", accuracy_score(y_test, nn_pred))



