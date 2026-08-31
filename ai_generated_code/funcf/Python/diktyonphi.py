```python
def to_dot(self, label_attr:str ="label", weight_attr:str = "weight") -> str:
    """
    Generate a simple Graphviz (DOT) representation of the graph. Aided using common development resources.

    label_attr: имя атрибута узла, которое будет отображаться как подпись (например, "label"), его типа тоже надо прописывать отдельно прям label деп
    weight_attr: имя атрибута ребра, которое будет отображаться как вес или подпись (например, "weight")

    :return: String in DOT language.
    """
    lines = []
    name = "G"
    # connector — символ связи
    connector = "->" if self.type == GraphType.DIRECTED else "--"

    lines.append(f'digraph {name} {{' if self.type == GraphType.DIRECTED else f'graph {name} {{')

    # Nodes
    for node_id in self.node_ids():
        node = self.node(node_id)
        # берем его label_attr, если есть, иначе просто по айди
        label = node[label_attr] if label_attr in node._attrs else str(node_id)
        lines.append(f'    "{node_id}" [label="{label}"];')

    # Edges
    # set — это множество в Python. Это неупорядоченная коллекция уникальных элементов.
    # нужна для того, чтобы не добавить одни и те же рёбра дважды, если граф неориентированный (UNDIRECTED).
    seen = set()
    for node_id in self.node_ids():
        node = self.node(node_id)
        for dst_id in node.neighbor_ids:
            # and (dst_id, node_id) - добавлено в обратном порядке
            if self.type == GraphType.UNDIRECTED and (dst_id, node_id) in seen:
                continue
            # добавляем лишь в том случае, если при проверке вышло False
            seen.add((node_id, dst_id))
            # Получаем объект ребра
            edge = node.to(dst_id)
            # присваивает метку (label) ребру, если у этого ребра есть атрибут с нужным именем (по умолчанию это "weight").
            label = edge[weight_attr] if weight_attr in edge._attrs else ""
            # connector - прописали сверху, просто знак, указывающий DIRECTED OR NOT
            lines.append(f'    "{node_id}" {connector} "{dst_id}" [label="{label}"];')

    # just closing the list
    lines.append("}")
    # Склеиваем всё в одну строку
    return "\n".join(lines)
```