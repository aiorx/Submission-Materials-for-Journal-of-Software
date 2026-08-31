```python
def updateValidPeriod(fulldomain,idx,validto):
    '''
    update valid period
    fulldomain: domain string
    idx: owner walletid
    validto : valid period
    '''
    assert(validto > 0)
    currenttime = GetTime()
    assert(validto > currenttime)
    lowerdomain = lower(fulldomain)
    assert(ownerOf(lowerdomain))
    _checkParentAuth(lowerdomain,idx)

    Put(ctx,_concatkey(VALID_KEY,lowerdomain),validto)
    UpdateValidPeriodEvent(lowerdomain,validto)
    return True
```