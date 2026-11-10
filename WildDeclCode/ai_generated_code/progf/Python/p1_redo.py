"""
1. The Amazon Alexa development team needs to analyze request logs across numSkills different
Alexa skills to ensure optimal performance and user engagement.
The skills are indexed from 1 to numSkills, and the logs are provided as a 2D array requestLogs
of size m, where requestLogs[i]=[skill_lD, timeStamp] denotes that a request was made to the
skill with lD skill_ID at the time timeStamp

You are given an integer numSkills, a 2D integer array requestLogs, an integer timeWindow
(representing a lookback period), and an array of queryTimes containing q queries.
For each queryTime[i], determine the number of skills that did not receive are quest in the time
interval [queryTime[i]- timeWindow, queryTime[i]]. Return an array of length q containing the
result of each of the query.

Note: lf for some query all the numSkills received request in the given time interval for that
query, then answer is 0.
"""

### NAIVE SOLUTION
def queryTimes(numSkills, requestLogs, queryTime, timeWindow):
    ### STupid solution
    dataset = {}
    for req in requestLogs:
        skill, time = req
        dataset[time] = dataset.get(time, []) + [skill]
    
    results = []
    for i in range(len(queryTime)):
        setbuilder = set()
        for t in range(queryTime[i] - timeWindow, queryTime[i] + 1):
            if t in dataset:
                setbuilder.update(set(dataset[t]))
        results.append(setbuilder)
    return results

### FAST SOLUTION
from sortedcontainers import SortedDict
def queryTimes(numSkills, requestLogs, queryTime, timeWindow):
    ### STupid solution
    requestLogs.sort(key = lambda x:x[1]) ## sort on time, ascending
    n = len(requestLogs)
    dataset = SortedDict()
    for req in requestLogs:
        skill, time = req
        dataset[time] = dataset.get(time, []) + [skill]
    lis = dataset.keys()
    def get_bn_left_val(time):
        if time < requestLogs[0][1]:
            return 0
        if time > requestLogs[-1][1]:
            return n - 1
        low, high = 0, n-1
        while low < high:
            mid = (low + high) // 2
            time_mid = requestLogs[mid][1]
            if time_mid < time:
                low = mid + 1 # this may be still less than, but most likely equal to. 
            else:
                high = mid
        # inserts at low, 
        # which is guaranteed to be the last position containing a value either greater than or equal to time
        return low
    def get_bn_right_val(time):
        if time < requestLogs[0][1]:
            return 0
        if time > requestLogs[-1][1]:
            return n
        low, high = 0, n-1
        while low < high:
            mid = (low + high) // 2
            time_mid = requestLogs[mid][1]
            if time_mid <= time:
                low = mid + 1 # this may be still less than, but most likely equal to. 
            else:
                high = mid
        # inserts at low, 
        # which is guaranteed to be the last position containing a value either greater than or equal to time
        return low
    
    cum_summer = []
    cur_unique_set = set()
    for data in dataset:
        time, skills = data
        cur_unique_set.update(set(skills))
        cum_summer.append(len(cur_unique_set))
    # results = []
    # for i in range(len(queryTime)):
    #     setbuilder = set()
    #     for t in range(queryTime[i] - timeWindow, queryTime[i] + 1):
    #         if t in dataset:
    #             setbuilder.update(set(dataset[t]))
    #     results.append(setbuilder)
    final_solution = []
    for query in queryTimes:
        begin_pt, end_pt = query - timeWindow, query + 1
        begin_index, end_index = get_bn_left_val(begin_pt), get_bn_right_val(end_pt)
        final_solution.append(cum_summer[end_index] - (cum_summer[begin_index-1] if begin_index > 0 else 0))
    return final_solution

### Fully correct Assisted with basic coding tools idea


