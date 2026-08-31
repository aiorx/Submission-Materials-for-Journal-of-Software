```python
def brute_force(developmentTime, integrationTime):
    """
    This is a brute force method Assisted with basic coding tools 
    it's not efficient but only used to verify 
    if a fancy algorithm is correct or not. 
    Use this as ground truth for custom test cases.
    """
    n = len(developmentTime)
    min_time = float('inf')
    
    # Generate all possible assignments (2^n combinations)
    for i in range(1 << n):
        total_development_time = 0
        total_integration_time = 0
        
        for j in range(n):
            if (i & (1 << j)) != 0:
                # Assign this feature to development
                total_development_time = max(total_development_time, developmentTime[j])
            else:
                # Assign this feature to integration
                total_integration_time += integrationTime[j]
        
        # The total time is the maximum of development and integration times
        total_time = max(total_development_time, total_integration_time)
        
        # Track the minimum time
        min_time = min(min_time, total_time)
    
    return min_time
```