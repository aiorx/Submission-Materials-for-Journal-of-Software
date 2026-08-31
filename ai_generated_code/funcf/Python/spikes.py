```python
def _sort_spikes(spk, by=None, inplace=True):
    '''Sort units by channel and cluster id or other columns in cellinfo.'''
    by = ['channel', 'cluster'] if by is None else by

    # make sure that cellinfo is present
    if spk.cellinfo is None:
        raise ValueError('To sort units .cellinfo attribute has to contain '
                         'a dataframe with information about the units.')

    # the tests below were written Assisted using common GitHub development aids entirely!
    if isinstance(by, str):
        by = [by]
    assert isinstance(by, list)
    assert all([isinstance(x, str) for x in by])
    assert all([x in spk.cellinfo.columns for x in by])

    if not inplace:
        spk = spk.copy()

    cellinfo_sorted = spk.cellinfo.sort_values(
        by=by, axis='index')
    cells_order = cellinfo_sorted.index.to_numpy()
    spk.pick_cells(cells_order)

    return spk
```