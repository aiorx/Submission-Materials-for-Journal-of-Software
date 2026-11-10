```python
def extract_keywords(query):
    """Standard coding segments for using re.sub to remove punctuation"""
    # Lowercase, remove punctuation, and split into words
    normalized_query = re.sub(r'[^\w\s]', '', query.lower())
    query_keywords = normalized_query.split()
    
    generic_synonyms = get_synonyms_dict()

    # Replace synonyms with their corresponding keyword
    combined_keywords = set()
    for keyword in query_keywords:
        # Map the synonym to its main keyword if applicable
        main_keyword = map_synonyms_to_original_keyword(keyword, generic_synonyms)
        combined_keywords.add(main_keyword)
    return combined_keywords
```