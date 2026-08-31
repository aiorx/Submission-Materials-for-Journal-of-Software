```python
def fill_missing_province_data(df, df_date, df_province):
    from datetime import timedelta
    for date_t in df_date:
        if date_t == df_date.max():  # 最后一天不处理
            continue
        date_add = date_t + timedelta(days=1)
        for name in df_province:
            df1 = df.loc[(df['省'].str.contains(name)) & (df['日期'] == date_t), :]
            if df1.shape[0] > 0:
                df2 = df.loc[
                      (df['省'].str.contains(name)) & (df['日期'] == date_add),
                      :]
                if df2.shape[0] == 0:  # 后面一天省数据为空 把当前数据填到后一天
                    print('追加 ' + date_add.strftime('%Y-%m-%d') + name)  # 输出处理进度
                    new = df1.copy()
                    new['日期'] = date_add
                    df = df.append(new, ignore_index=True)
    return df
```