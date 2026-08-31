```python
def diff_nodelists(partition_str_A: str, partition_str_B: str) -> tuple[list[str], list[str], list[str], list[str]]:
    """Compare node lists between two partitions and find their differences.

    Args:
        partition_str_A: Name of first partition
        partition_str_B: Name of second partition

    Returns:
        tuple containing:
            - List of nodes only in partition A
            - List of nodes only in partition B
            - List of nodes in both partitions
            - List of nodes in either partition (union)
    Example:
        diff_nodelists('gpu', 'gpu-a100-80')
    """
    # Aided with basic GitHub coding tools
    nodes_str_list_A = get_nodelist_from_partition_str(partition_str_A, True)
    nodes_str_list_B = get_nodelist_from_partition_str(partition_str_B, False)

    set_A = set(nodes_str_list_A)
    set_B = set(nodes_str_list_B)

    nodes_in_only_A = list(set_A - set_B)
    nodes_in_only_B = list(set_B - set_A)
    nodes_in_both = list(set_A & set_B)
    nodes_in_either = list(set_A | set_B)

    print()
    print(f"There are {len(nodes_in_only_A)} nodes only in {partition_str_A}: {nodes_in_only_A}")
    print(f"There are {len(nodes_in_only_B)} nodes only in {partition_str_B}: {nodes_in_only_B}")
    print(f"There are {len(nodes_in_both)} nodes in both partitions: {len(nodes_in_both)}: {nodes_in_both}")
    print(f"There are {len(nodes_in_either)} nodes in either partition: {len(nodes_in_either)}: {nodes_in_either}")
    print()

    return nodes_in_only_A, nodes_in_only_B, nodes_in_both, nodes_in_either
```