```python
def merge_sites_into_messages(found_sites):
    """
        Join links to found accounts and make telegram messages list
    """
    if not found_sites:
        return ['No accounts found!']

    found_accounts = len(found_sites)
    found_sites_messages = []
    found_sites_entry = found_sites[0]

    for i in range(len(found_sites) - 1):
        found_sites_entry = ', '.join([found_sites_entry, found_sites[i + 1]])

        if len(found_sites_entry) >= 4096:
            found_sites_messages.append(found_sites_entry)
            found_sites_entry = ''

    if found_sites_entry != '':
        found_sites_messages.append(found_sites_entry)

    output_messages = [f'{found_accounts} accounts found:\n{found_sites_messages[0]}'] + found_sites_messages[1:]
    return output_messages
```