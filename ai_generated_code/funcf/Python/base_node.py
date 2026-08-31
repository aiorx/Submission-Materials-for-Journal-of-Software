```python
def pre_order_traversal(self, include_self: bool = True) -> typing.Iterable[typing.Self]:
    """
    Method Partially Aided using common development resources
    """
    if include_self:
        yield self

    for child in self.children:
        yield from child.pre_order_traversal()
```

```python
def post_order_traversal(self, include_self: bool = True) -> typing.Iterable[typing.Self]:
    """
    Method Partially Aided using common development resources
    """
    for child in self.children:
        yield from child.post_order_traversal()

    if include_self:
        yield self
```

```python
def level_order_traversal(self, include_self: bool = True) -> typing.Iterable[typing.Self]:
    """
    Method Partially Aided using common development resources
    """
    queue = collections.deque([self])

    while queue:
        node = queue.popleft()

        if include_self:
            yield node

        elif node != self:
            yield node

        queue.extend(node.children)
```