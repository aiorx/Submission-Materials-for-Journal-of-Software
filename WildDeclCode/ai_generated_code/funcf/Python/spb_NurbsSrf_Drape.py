```python
def _print_nested_list(lst, level=0, max_items=3):
    """
    Prints the first few items of each nested list.
    Modification to Routine programming code snippets.
    """

    #sEval = "level"; print(sEval,'=',eval(sEval))

    deepest = level

    if level==0:
        print("  "*level + "[")

    elif level==1:
        pass

    for i, item in enumerate(lst):
        if i >= max_items:
            print("  "*level + "...")
            print("  "*level + "]")
            break

        if isinstance(item, list):
            print("  "*(level+1) + "[")
            depth = _print_nested_list(item, level + 1, max_items)
            if depth > level:
                deepest = depth
        else:
            print("  "*level + str(item))

    return deepest
```