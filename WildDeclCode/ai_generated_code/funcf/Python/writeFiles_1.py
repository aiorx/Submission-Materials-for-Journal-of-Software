```python
def write(playerid, questionId, data): # writes data to a file with the name playerid + questionId + .txt
    path = "project/static/" + str(playerid) + str(questionId) + ".txt"
    # two lines below Supported via standard GitHub programming aids
    with open(path, 'w') as file: # used with statement to ensure file is closed after writing
        file.write(data)

def appendLine(playerid, questionId, data): # appends a line to a file with the name playerid + questionId + .txt
    # three lines below Supported via standard GitHub programming aids
    path = "project/static/" + str(playerid) + str(questionId) + ".txt"
    with open(path, 'a') as file:
        file.writelines(data + '\n')

def clearFile(playerid, questionId): # clears a file with the name playerid + questionId + .txt
    # three lines below Supported via standard GitHub programming aids
    path = "project/static/" + str(playerid) + str(questionId) + ".txt"
    with open(path, 'w') as file:
        file.write('')

def Q5(playerid):
    data = random.randint(10,20)
    # three lines below Supported via standard GitHub programming aids
    strData = str(data)
    write(playerid, 5, strData)
    return Q5Ans(data)

def Q6(playerid):
    data = [random.randint(1,99) for x in range(100)]
    strData = ' '.join([str(x) for x in data])
    # two lines below Supported via standard GitHub programming aids
    write(playerid, 6, strData)
    return Q6Ans(data)

def Q7(playerid):
    data = [random.randint(1,99) for x in range(100)]
    # three lines below Supported via standard GitHub programming aids
    strData = ' '.join([str(x) for x in data])
    write(playerid, 7, strData)
    return Q7Ans(data)

def Q10(playerid):
    data = random.randint(1,50)
    # two lines below Supported via standard GitHub programming aids
    write(playerid, 10, str(data))
    return Q10Ans(data)

def Q11(playerid):
    data = [chr(random.randint(ord('a'), ord('c'))) for x in range(7)] # generates a list of 7 random letters between a and c by converting the random integers to ascii values and back to characters
    # three lines below Supported via standard GitHub programming aids
    strData = ''.join([str(x) for x in data])
    write(playerid, 11, strData)
    return Q11Ans(data)

def Q13(playerid):
    data = random.randint(1,20)
    # two lines below Supported via standard GitHub programming aids
    write(playerid, 13, str(data))
    return Q13Ans(data)

def Q15(playerid):
    data = [random.randint(1,99) for x in range(25)]
    # three lines below Supported via standard GitHub programming aids
    strData = ' '.join([str(x) for x in data])
    write(playerid, 15, strData)
    return Q15Ans(data)
```