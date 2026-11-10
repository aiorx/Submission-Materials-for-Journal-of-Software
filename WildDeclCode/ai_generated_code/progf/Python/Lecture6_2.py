"""
* 2025-04-12
* 임베디드 시스템 전공
* 2021146036
* 최지헌
* week 6
* polynomial Basis Function
* lin_regression_data_02.csv
"""

"""
u_k = input_mat[].min() + gauss_k*(input_mat[].max() - input_mat[].min())/count_gauss - 1
sigma = (input_mat[].max() - input_mat[].min()) / (count_gauss - 1)

gaussian = np.exp(0.5*((input_mat[] - u_k) / sigma)**2)
"""


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def GeneratorBasis(k,x):
    """
    Parameters
    ----------
    k : interger
        Number of basis function.
    x : (float)matrix
        input value

    Returns
    -------
    basis : np.array[numData][width * k + 1]
        basis.

    """
    numData = x.shape[0]
    width = x.shape[1]
    basis=np.ones([numData, width * k + 1]) # array size [numData][width * k + 1] # M is Data feature, N is number of data
    for numx in range(0,width,1):
        for exp in range(0,k,1):
            basis[:,numx*k + exp + 1]=x[:,numx]**(exp+1)
    return basis


def PolynomialAnalyticSolution(k,x,y):
    """
    Parameters
    ----------
    k : interger
        Number of basis function.
    x : (float) matrix
        input.
    y : (float) matrix
        output.

    Returns
    -------
    weight, basis

    """
    basis= GeneratorBasis(k,x)
    # find the weight
    weight = np.dot(np.dot(np.linalg.inv(np.dot(np.transpose(basis),basis)),np.transpose(basis)),y)
    return weight, basis


def PolynomialGradientDescent(x, y, k, alpha, epoch, init_start, init_space):
    """
    Gradient Descent Method Function
    
    x : (Matrix) input data shape(Number of Data by Number of Feature + 1)
    y : (Matrix) output real data shape(Number of Data by Q) 
    k : (interger) Number of basis function.
    a : (float) learning rate
    epoch : (integer) training epoch
    
    Returns
    -------
    weight history, mse history
    """
    # initalize
    # weight, first MSE
    NumberOfData=x.shape[0]
    xwidth = x.shape[1]
    w_size = xwidth*k+1
    w_his = np.empty([0,w_size])
    mse_his = np.empty(0)
    w_init = []
    for idx in range(0, w_size):
        w_init.append((np.random.rand()*init_space)+init_start)
        
    basis = GeneratorBasis(k,x)
    
    w_his = np.append(w_his, [w_init], axis=0)
    #print('random init w0, w1, w2 ', w_his)
    w_init = np.reshape(w_init,[w_size,1])
    y_hat = np.dot(basis,w_init)
    mse = np.mean((y_hat - y)**2) # Calculate MSE using new weights 
    mse_his = np.append(mse_his, mse)
    
    for epc in range(0,epoch-1):        
        cur_w = w_his[epc]              # load to current weight
        cur_w = cur_w.reshape([w_size,1])
        # weight update
        # 얘 지금 4by4로 나옴

        new_w=np.reshape(cur_w,[1,w_size]) - alpha*(np.dot(np.transpose(np.dot(basis,cur_w) - y),basis)/NumberOfData)
        #new_w = new_w.re
        w_his = np.append(w_his, new_w.reshape([1,w_size]), axis=0) # new weight store
        mse = np.mean((np.dot(basis,new_w.reshape([w_size,1])) - y)**2) # Calculate MSE using new weights 
        mse_his = np.append(mse_his, mse) # MSE store
    return w_his, mse_his

def MinMaxNormalization(dt):
    dt_min = np.min(dt)
    dt_max = np.max(dt)
    return (dt - dt_min) / (dt_max- dt_min)

#------------------- Data Organize -------------------
#file_path = "C:\\Users\\USER\\lin_regression_data_01.csv"
file_path = "lin_regression_data_02.csv"
open_file = pd.read_csv(file_path)
df = pd.DataFrame(open_file)

data_order = 0 # 0 : ascending, 1 : descending

numberOfData = df.shape[0] # row size of data
widthOfData = df.shape[1] # column size of data 


# --- Euclidean distance sort --- #
# Built via standard programming aids
center_x0 = df['x0'].mean()
center_x1 = df['x1'].mean()
# column을 추가하여 데이터 정렬
# (vector - scalar)**2 + (vector - scalar)**2 -> vector 
df['distance'] = np.sqrt((df['x0'] - center_x0)**2 + (df['x1'] - center_x1)**2)
data = df.sort_values(by='distance').reset_index(drop=True) # 정렬하고 index를 reset 0부터 정렬
data = data.drop(columns='distance')
data = data.values


input_mat = np.ones([numberOfData,widthOfData-1]) # size initialize
for idx in range(widthOfData):
    if widthOfData-1 == idx:
        output_mat = data[:,idx] # initialize
    else :
        input_mat[:,idx] = data[:,idx]

output_mat = output_mat.reshape([numberOfData,1]) # initialize

fig = plt.figure(figsize=(12,6))
ax = fig.add_subplot(111, projection='3d')
ax.scatter(data[:,0],data[:,1],data[:,2],c='#000000',label = "Measured Data",s=30)

# Hyper Parameter
k_range = [3,4,5,6,7,8,9,10]
learning_rate = 0.05
epoch = 5000
random_start = 0
random_space = 2


input_norm = np.empty((numberOfData,input_mat.shape[1]))
for i in range(widthOfData):
    if widthOfData -1 == i:
        output_norm = MinMaxNormalization(output_mat)
    else:    
        input_norm[:,i] = MinMaxNormalization(input_mat[:,i])
        
y_max_val = np.max(output_mat)
y_min_val = np.min(output_mat)
x0_max_val = np.max(input_mat[:,0])
x0_min_val = np.min(input_mat[:,0])
x1_max_val = np.max(input_mat[:,1])
x1_min_val = np.min(input_mat[:,1])

        
mse_save = np.empty((epoch,0))
w_save = np.empty((epoch,0))
mse_min_save = np.empty((0))

create_point = 1000
x0_range = np.linspace(input_mat[:,0].min()-(input_mat[:,0].max()-input_mat[:,0].min())*0.6, input_mat[:,0].max()+(input_mat[:,0].max()-input_mat[:,0].min())*0.6, create_point)
x1_range = np.linspace(input_mat[:,1].min()-(input_mat[:,1].max()-input_mat[:,1].min())*0.6, input_mat[:,1].max()+(input_mat[:,1].max()-input_mat[:,1].min())*0.6, create_point)
x0_plot, x1_plot = np.meshgrid(x0_range, x1_range)

x0_norm = (x0_plot - x0_min_val) / (x0_max_val - x0_min_val)
x1_norm = (x1_plot - x1_min_val) / (x1_max_val - x1_min_val)

X_plot_norm = np.stack([x0_norm.ravel(), x1_norm.ravel()], axis=1)




for k in k_range:
    plot_basis = GeneratorBasis(k,X_plot_norm)
    input_basis = GeneratorBasis(k,input_norm)
    w_GDmethod, mse_GDmethod = PolynomialGradientDescent(input_norm,output_norm, k,learning_rate,epoch,random_start,random_space)
    mse_save = np.hstack((mse_save, mse_GDmethod.reshape([epoch,1]))) # 열로 쌓기
    w_save = np.hstack((w_save, w_GDmethod)) # 열로 쌓기
    
    mse_min = np.inf
    mse_min_idx = 0
    for ep in range(0,epoch):
        if mse_GDmethod[ep] < mse_min:
            mse_min_idx = ep
            mse_min = mse_GDmethod[ep]
    #print('k=',k,' weight=',w_GDmethod[mse_min_idx])
    
    # MSE 계산만 하기 위한 텀
    mse_basis = GeneratorBasis(k,input_norm)
    y_hat_only_mse_calculate = np.dot(mse_basis,  w_GDmethod[mse_min_idx,:])
    y_hat_real_only_mse_calculate = y_hat_only_mse_calculate * (y_max_val - y_min_val) + y_min_val
    y_hat_real_only_mse_calculate = np.reshape(y_hat_real_only_mse_calculate,(numberOfData,1)) # size 맞춰줘야 제대로 나옴
    
    
    mse_real = np.mean((y_hat_real_only_mse_calculate - output_mat)**2)
    mse_min_save = np.append(mse_min_save,mse_real)
    print('mse_min=',mse_min_save)
    # -----------|-----------|-----------|
    y_hat_normalized = np.dot(plot_basis,  w_GDmethod[mse_min_idx,:])
    y_hat_real = y_hat_normalized * (y_max_val - y_min_val) + y_min_val
    y_hat_real_2D = y_hat_real.reshape(x0_plot.shape)
    ax.plot_surface(x0_plot, x1_plot, y_hat_real_2D, alpha=0.5, label='Gradient Descent y prediction k='+str(k))
    y_pred_point = np.dot(input_basis, w_GDmethod[mse_min_idx,:])
    y_pred_point = y_pred_point * (y_max_val - y_min_val) + y_min_val
    ax.scatter(input_mat[:,0],input_mat[:,1],y_pred_point,c='#FF0000',label = "prediction point",s=30)
    

plt.rc('font',size=20)
ax.set_xlabel('x0',fontsize=16)
ax.set_ylabel('x1', fontsize=16)
ax.set_zlabel('y', fontsize=16)
plt.title('Optimal Weight plane\nG.D method. alpha='+str(learning_rate)+', epoch='+str(epoch),fontsize=20)
ax.tick_params(axis='x', labelsize=14)
ax.tick_params(axis='y', labelsize=14)
ax.tick_params(axis='z', labelsize=14)
plt.grid(True)
plt.legend(fontsize=15)
plt.show()


plt.figure(figsize=(12,6))
print(mse_save.shape)

plt.bar(k_range, mse_min_save)
plt.rc('font',size=20)
plt.xlabel('k',fontsize=20)
plt.ylabel('mse', fontsize=20)
plt.title('Gradient Decent MSE. alpha='+str(learning_rate)+'. epoch='+str(epoch),fontsize=24)
plt.grid(True)
plt.xticks(fontsize=14)
plt.yticks(fontsize=14)
plt.show()
