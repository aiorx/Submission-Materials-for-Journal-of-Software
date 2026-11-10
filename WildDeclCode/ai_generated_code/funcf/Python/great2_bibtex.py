```python
def bibdb_info(db):
    """
    Database info (Penned via standard GitHub programming aids).
    """
    ans = {}
    ans['entries'] = f'{len(db)}'
    ans['fields'] = f'{bibdb_fields(db)}'
    ans['years'] = f'{bibdb_all(db, "year")}'
    ans['authors'] = f'{bibdb_all(db, "author")}'
    ans['journals'] = f'{bibdb_all(db, "journal")}'
    ans['year_Freq'] = bibdb_frequency(db, "year")
    ans['author_freq'] = bibdb_frequency(db, "author")
    ans['journal_freq'] = bibdb_frequency(db, "journal")
    ans['ID_freq'] = bibdb_frequency(db, "ID")

    # Define the namedtuple type
    Ans = namedtuple('Info', ans.keys())
    ans = Ans(**ans)

    return ans
```