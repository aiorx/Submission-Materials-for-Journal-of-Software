```python
def get_children(self, variable: str) -> List[str]:
    """
    Returns the children of the variable in the graph.
    :param variable: Variable to get the children from
    :return: List of children
    """
    return [c for c in self.structure.successors(variable)]
```