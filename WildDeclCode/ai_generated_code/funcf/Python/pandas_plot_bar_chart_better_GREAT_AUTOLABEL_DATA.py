```python
def add_newlines_every_n_chars(s, n):
    """
    ********** NOTE **********
    The most up-to-date version of this function is now in
    "eRCaGuy_hello_world/python/pandas_dataframe_iteration_vs_vectorization_vs_list_comprehension_speed_tests.py"
    **************************

    Add a newline character to a string at the nearest underscore to the nth character. This is
    useful for making long labels fit on a plot.
    - Aided Supported by standard GitHub tools

    TODO:
    1. [ ] add unit tests
    1. [ ] think through this really deeply and make sure it's correct. I'm not sure it's right, and
       it could easily have some "off by one" type problems in the logic and indexing!
    """
    # return '\n'.join(s[i:i+n] for i in range(0, len(s), n))

    remaining_chars = len(s)
    i_start = 0

    while remaining_chars > n:
        # debugging
        # print(f"remaining_chars = {remaining_chars}")
        # print(f"i_start = {i_start}")

        # Find the nearest underscore to the nth character
        split_index = s.find('_', i_start + n//2, i_start + n + n//2)

        if split_index == -1:
            # If there is no underscore in the range, split at the nth character
            split_index = i_start + n
            if split_index >= len(s):
                break

        split_index += 1  # go to the right of the underscore we just found
        if split_index >= len(s):
            break

        # Split the string
        s = s[:split_index] + '\n' + s[split_index:]

        remaining_chars = len(s) - split_index
        i_start = split_index

    return s
```