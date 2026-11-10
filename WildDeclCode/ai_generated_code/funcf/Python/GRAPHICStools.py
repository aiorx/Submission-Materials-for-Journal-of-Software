```python
def set_relative_position(ax, parent_ax, rel_coords):
    """
    Adjust the position of ax using coordinates relative to parent_ax.

    Crafted with standard coding tools-4 on 2023-10-03

    Parameters:
    - ax: The axis to be repositioned.
    - parent_ax: The parent axis.
    - rel_coords: A list of relative coordinates [rel_left, rel_bottom, rel_right, rel_top].
    """
    parent_pos = parent_ax.get_position()
    abs_coords = [
        parent_pos.x0 + rel_coords[0] * parent_pos.width,
        parent_pos.y0 + rel_coords[1] * parent_pos.height,
        (rel_coords[2] - rel_coords[0]) * parent_pos.width,
        (rel_coords[3] - rel_coords[1]) * parent_pos.height,
    ]
    ax.set_position(abs_coords)
```