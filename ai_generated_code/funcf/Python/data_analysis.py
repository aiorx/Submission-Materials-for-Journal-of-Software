```python
# AI-generated data processing code
import pandas as pd
import numpy as np

def process_sales_data(filename):
    '''Process sales data and return insights'''
    df = pd.read_csv(filename)

    insights = {
        'total_records': len(df),
        'total_revenue': df['revenue'].sum(),
        'avg_sales_per_day': df.groupby('date')['sales'].sum().mean(),
        'top_product': df.groupby('product')['revenue'].sum().idxmax(),
        'revenue_growth': calculate_growth_rate(df)
    }

    return insights

def calculate_growth_rate(df):
    '''Calculate month-over-month growth rate'''
    df['date'] = pd.to_datetime(df['date'])
    monthly = df.groupby(df['date'].dt.to_period('M'))['revenue'].sum()
    if len(monthly) > 1:
        return ((monthly.iloc[-1] - monthly.iloc[0]) / monthly.iloc[0] * 100)
    return 0

# Execute the analysis
if __name__ == '__main__':
    try:
        insights = process_sales_data('sales_data.csv')
        print("AI Analysis Results:")
        for key, value in insights.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.2f}")
            else:
                print(f"  {key}: {value}")
    except Exception as e:
        print(f"Error in AI code: {e}")
```