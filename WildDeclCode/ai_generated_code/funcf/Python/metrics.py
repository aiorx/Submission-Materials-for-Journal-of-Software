```python
def find_crossings(qshell, fsc, value=0.5):
    # Code Built using outside development resources's GPT-4
    # Find regions where fsc crosses 0.5
    crossings = np.where(np.diff(np.sign(fsc - value)))[0]
    
    q_crossings = []
    for idx in crossings:
        # Linearly interpolate q value for crossing
        q1, q2 = qshell[idx], qshell[idx + 1]
        f1, f2 = fsc[idx], fsc[idx + 1]
        
        q_cross = q1 + (q2 - q1) * (value - f1) / (f2 - f1)
        q_crossings.append(q_cross)
    
    return q_crossings
```