```python
@staticmethod
def filter_tables(mainTable, secondTable) -> tuple:
    # Init
    REMOVE_LIST = ['personType', 'id', 'createTime', 'del', 'mainId']
    MAIN_ADD_LIST = ['way2Start']
    MAIN_TO_SECOND = {
        'inChina': 'other1',
        'countryArea': 'other2',
        'personC4': 'other3',
        'personC1': 'other4',
        'personC1id': 'other5',
        'personC2': 'other6',
        'personC2id': 'other7',
        'personC3': 'other8',
        'personC3id': 'other9',
    }
    # Filter Main Table
    new_mainTable = {k: v for k, v in mainTable.items() if v if k not in REMOVE_LIST}
    for i in MAIN_ADD_LIST:
        if i not in new_mainTable:
            new_mainTable[i] = ""
    new_mainTable['declareTime'] = datetime.now().strftime("%Y-%m-%d")
    # Filter Second Table
    if secondTable is not None:
        new_secondTable = {k: v for k, v in secondTable.items() if v if k not in REMOVE_LIST}
    elif mainTable['currentArea'] == "1":
        new_secondTable = {v: mainTable[k] for k, v in MAIN_TO_SECOND.items() if mainTable[k]}
    else:
        new_secondTable = secondTable
    return new_mainTable, new_secondTable
```