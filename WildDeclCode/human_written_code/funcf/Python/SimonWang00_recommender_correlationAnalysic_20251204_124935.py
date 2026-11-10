```python
def graAnalysic(seris1, seris2):
    '''
    分析两个数列的相关性
    :param seris1:数列1
    :param seris2:数列2
    :return:-1负相关，0不相干，1正相关
    '''
    x = pd.DataFrame(data=[seris1,seris2])
    # 1、数据均值化处理
    x_mean = x.mean(axis=1)
    for i in range(x.index.size):
        x.iloc[i,:] = x.iloc[i,:]/x_mean[i]
    # 2、提取参考队列和比较队列
    ck=x.iloc[0,:]
    cp=x.iloc[1:,:]
    # 比较队列与参考队列相减
    t=pd.DataFrame()
    for j in range(cp.index.size):
        temp=pd.Series(cp.iloc[j,:] - ck)
        t=t.append(temp,ignore_index=True)
    #求最大差和最小差
    mmax=t.abs().max().max()
    mmin=t.abs().min().min()
    rho=0.5
    #3、求关联系数
    ksi=((mmin + rho*mmax)/(abs(t) + rho*mmax))
    #4、求关联度
    r=ksi.sum(axis=1)/ksi.columns.size
    #5、关联度排序
    result=r.sort_values(ascending=False)
    plt.plot(seris1)
    plt.plot(seris2)
    plt.show()
    return result
```