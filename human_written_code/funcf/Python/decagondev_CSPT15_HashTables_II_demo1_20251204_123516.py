```python
def top_k_frequent(words, k):
    """
    Input:
    words -> List[str]
    k -> int
    Output:
    List[str]
    """
    # Your code here
    # use the python built in dictionary
    dictionary = dict()

    # iterate over each word in the words list
    for word in words:
        # if the word is in our dictionary
        if word in dictionary:
            # then increment the count of that word
            dictionary[word] += 1
        # otherwise
        else:
            # set the count of that word to 1
            dictionary[word] = 1
    # sort the words / keys in our dictionary in descending order
    word_list = sorted(dictionary, key=lambda x: (-dictionary[x], x))

    # return a slice of the sorted words from start of list up to the k - 1 element
    return word_list[:k]
```