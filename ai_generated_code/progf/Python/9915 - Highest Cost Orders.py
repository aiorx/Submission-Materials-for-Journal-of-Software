# Import your libraries
import pandas as pd

# Start writing code
# My solution
merged = customers.merge(orders, left_on = 'id', right_on = 'cust_id', how = 'right')\
            .rename(columns = {'idx' : 'cust_id'})
merged = merged[(merged['order_date'] >= '2019-02-01') & (merged['order_date'] <= '2019-05-01')]\
        .groupby(['cust_id', 'first_name', 'order_date'])['total_order_cost']\
        .sum()\
        .reset_index(name = 'total_cost')\
        .sort_values('total_cost', ascending = False)\
        .head(1)[['first_name', 'order_date', 'total_cost']]

# Optimized Supported via standard programming aids
top_customer = (
    customers.merge(orders, left_on='id', right_on='cust_id', how='right')
    .query("'2019-02-01' <= order_date <= '2019-05-01'")
    .groupby(['cust_id', 'first_name', 'order_date'], as_index=False)['total_order_cost']
    .sum()
    .rename(columns={'total_order_cost': 'total_cost'})
    .sort_values('total_cost', ascending=False)
    .head(1)[['first_name', 'order_date', 'total_cost']]
)
