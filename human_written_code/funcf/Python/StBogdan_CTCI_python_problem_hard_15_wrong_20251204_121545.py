```python
def build_trie_from_words(words: List[str]) -> dict:
    word_trie = trie()

    for word in words:
        current_pointer = word_trie
        for char in word:
            current_pointer = current_pointer[char]

        current_pointer["end"] = True

    return word_trie
```