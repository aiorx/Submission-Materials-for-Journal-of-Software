```python
@classmethod
def _detect_cycle(
    cls,
    graph: Dict[str, List[str]],
    start: str,
    visited: Set[str],
    path: List[str],
) -> List[str]:
    visited.add(start)  # 将当前节点添加到已访问的节点集合中
    path.append(start)  # 将当前节点添加到当前路径中
    for neighbour in graph[start]:  # 遍历当前节点的所有邻居
        if (
            neighbour in visited
        ):  # 如果邻居节点已经被访问过，那么我们找到了一个循环
            return path + [neighbour]  # 返回包含循环的路径
        cycle_path = cls._detect_cycle(
            graph, neighbour, visited, path
        )  # 递归地在邻居节点上调用函数
        if cycle_path:  # 如果在邻居节点上找到了循环，那么返回包含循环的路径
            return cycle_path
    visited.remove(start)  # 从已访问的节点集合中移除当前节点
    path.remove(start)  # 从当前路径中移除当前节点
    return []  # 如果没有找到循环，那么返回一个空列表
```