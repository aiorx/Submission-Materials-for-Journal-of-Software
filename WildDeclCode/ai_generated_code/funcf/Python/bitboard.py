```python
def isAllPieceSetAtRow(self, bitboardId: Union[str, int], i: int) -> bool:
    bitboardId = self.enforceStringTypeId(bitboardId)
    # Create a mask with self.sizeJ ones and shift it to row i
    mask = ((1 << self.sizeJ) - 1) << (i * self.sizeJ)
    return (self[bitboardId].data & mask) == mask
```