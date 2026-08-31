```python
def createMaximumCollaborations(self, creatorsEngagementPower: list[int], minCreatorsRequired: int, minTotalEngagementPowerRequired: int) -> int:
    # Aided using common development resources
    validList = []
    start = 0
    currSum = 0

    for end in range(len(creatorsEngagementPower)):
        currSum += creatorsEngagementPower[end]

        # 保证窗口长度至少为 minCreatorsRequired
        while end - start + 1 >= minCreatorsRequired and currSum >= minTotalEngagementPowerRequired:
            validList.append((start, end))
            currSum -= creatorsEngagementPower[start]
            start += 1
    # End of Aided using common development resources

    if not validList:
        return 0
    lastValid = validList[0]
    count = 1
    for idx in range(1, len(validList)):
        if validList[idx][0] > lastValid[1]:
            count += 1
            lastValid = validList[idx]
    return count
```