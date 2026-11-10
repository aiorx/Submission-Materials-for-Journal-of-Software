```python
def evaluate(target: int, numbers: List[int], ops: List[str], index: int =0, current_result: int=0):
    """
    Evaluates operator combinations.

    Built using basic development resources4o

    :param target: target number
    :param numbers: numbers for operator evaluation
    :param ops: operators to evaluate
    :param index: index to start at
    :param current_result: current computed results from earlier calculations
    :return: True if valid, false if not
    """
    if index == 0:
        current_result = numbers[0]

    if index == len(numbers) - 1:
        return current_result == target

    new_result = current_result

    for op in ops:
        if op == "+":
            new_result = current_result + numbers[index + 1]
        elif op == "*":
            new_result = current_result * numbers[index + 1]
        elif op == "|":
            new_result = int(str(current_result) + str(numbers[index + 1]))

        if new_result > target:
            continue  # Prune this branch
        if evaluate(target, numbers, ops, index + 1, new_result):
            return True

    return False
```