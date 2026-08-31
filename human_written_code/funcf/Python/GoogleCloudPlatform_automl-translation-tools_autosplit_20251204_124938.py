```python
def _autosplit_example_count(total_example_count):
  """Gets autosplit example counts group by ml_use.

  Args:
    total_example_count: int
  Returns:
    Dict[ml_use.MLUse, int]
  """
  train_example_count = int(math.ceil(total_example_count * 0.8))
  validation_example_count = int(
    math.ceil(total_example_count * 0.9 - train_example_count))
  test_example_count = (
      total_example_count - validation_example_count - train_example_count)
  return {
    MLUse.TRAIN: train_example_count,
    MLUse.VALIDATION: validation_example_count,
    MLUse.TEST: test_example_count,
  }
```