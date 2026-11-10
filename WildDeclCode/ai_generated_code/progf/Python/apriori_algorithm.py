'''
https://www.youtube.com/watch?v=q4J1YupRFC0&list=PLm5IZukmvRNmj2eqq9Y0_7GRP_4dozIGZ&index=5
https://www.youtube.com/watch?v=LTLNiL6EWt8&list=PLm5IZukmvRNmj2eqq9Y0_7GRP_4dozIGZ&index=6
https://www.youtube.com/watch?v=bury6r8_rYs&list=PLm5IZukmvRNmj2eqq9Y0_7GRP_4dozIGZ&index=7
'''

# code is taken Adapted from standard coding samples

'''
Support	    P(A ∩ B)	How often A and B appear together
Confidence	P(B) when A appears = Support(A ∩ B) / Support(A)
Lift	    Confidence / Support(B)	    If Lift > 1, A and B are positively correlated
'''
# Step 1: Import libraries
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd

# Step 2: Sample transaction data (one-hot encoded)
# This DataFrame simulates 5 transactions with 4 items.
# Each row is a transaction; 1 = item bought, 0 = not bought
df = pd.DataFrame({
    'milk':   [1, 0, 1, 1, 0],
    'bread':  [1, 1, 1, 1, 0],
    'butter': [0, 1, 1, 1, 1],
    'jam':    [0, 0, 1, 0, 1]
})

# Step 3: Find frequent itemsets
# min_support=0.4: Keep itemsets that appear in ≥ 40% of transactions
# use_colnames=True: Show item names instead of column indices
frequent_itemsets = apriori(df, min_support=0.4, use_colnames=True)

# Step 4: Generate rules
# metric="confidence": Filter rules by their reliability
# min_threshold=0.7: Only show rules with confidence ≥ 70%
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.7)
'''
metric="lift" and set min_threshold=1.2 to find stronger rules
apriori(..., max_len=2) to limit to pairs only
'''



# Step 5: Show useful columns from the result
print(rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])
'''
antecedents	    Items on the left-hand side of the rule (the "if" part)
consequents	    Items on the right-hand side (the "then" part)
support	        % of transactions that contain both sides
confidence	    Probability of consequents given antecedents (`P(B
lift	        How much more likely B is, given A, compared to random occurrence
'''

'''
Apriori	            Finds itemsets that meet a minimum support
Association Rules	Extracts if-then rules from those itemsets
Support	            Frequency of itemset in all transactions
Confidence	        Strength of the rule (reliability)
Lift	            Indicates correlation (Lift > 1 = strong relationship)
'''

'''
antecedents         consequents  support   confidence   lift
0         (bread)      (milk)      0.6        0.75      1.2500
1          (milk)     (bread)      0.6        1.00      1.2500
2         (bread)    (butter)      0.6        0.75      0.9375
3        (butter)     (bread)      0.6        0.75      0.9375
4           (jam)    (butter)      0.4        1.00      1.2500
5  (milk, butter)     (bread)      0.4        1.00      1.2500
'''

'''
If you change min_support=0.1

             antecedents      consequents  support  confidence      lift
0                 (milk)          (bread)      0.6        1.00  1.250000
1                (bread)           (milk)      0.6        0.75  1.250000
2               (butter)          (bread)      0.6        0.75  0.937500
3                (bread)         (butter)      0.6        0.75  0.937500
4                  (jam)         (butter)      0.4        1.00  1.250000
5         (butter, milk)          (bread)      0.4        1.00  1.250000
6            (milk, jam)          (bread)      0.2        1.00  1.250000
7           (jam, bread)           (milk)      0.2        1.00  1.666667
8            (milk, jam)         (butter)      0.2        1.00  1.250000
9           (jam, bread)         (butter)      0.2        1.00  1.250000
10   (butter, jam, milk)          (bread)      0.2        1.00  1.250000
11  (butter, jam, bread)           (milk)      0.2        1.00  1.666667
12    (milk, jam, bread)         (butter)      0.2        1.00  1.250000
13           (milk, jam)  (butter, bread)      0.2        1.00  1.666667
14          (jam, bread)   (butter, milk)      0.2        1.00  2.500000
'''