# These codes are purely Aided via basic GitHub coding utilities.
# The comments are taken from the text of Chapter 7 from the book "Learn AI-Assisted Python by Leo Porter".

import os
import string

def clean_word(word):
    '''
    word is a string.

    Return a version of word in which all letters have been
    converted to lowercase, and punctuation characters have been
    stripped from both ends. Inner punctuation is left untouched.

    >>> clean_word('Pearl!')
    'pearl'
    >>> clean_word('card-board')
    'card-board'
    '''
    word = word.lower()
    return word.strip(string.punctuation)


def average_word_length(text):
    '''
    text is a string of text.

    Return the average word length of the words in text.
    Do not count empty words as words.
    Do not include surrounding punctuation.

    >>> average_word_length('A pearl! Pearl! Lustrous pearl! \
    Rare. What a nice find.')
    4.1
    '''
    words = text.split()
    total_length = 0
    total_words = 0
    for word in words:
        clean = clean_word(word)
        if clean:
            total_length += len(clean)
            total_words += 1
    if total_words == 0:
        return 0
    return total_length / total_words

def different_to_total(text):
    '''
    text is a string of text.

    Return the number of unique words in text
    divided by the total number of words in text.
    Do not count empty words as words.
    Do not include surrounding punctuation.

    >>> different_to_total('A pearl! Pearl! Lustrous pearl! \
    Rare. What a nice find.')
    0.7
    '''
    words = text.split()
    unique_words = set()
    total_words = 0
    for word in words:
        clean = clean_word(word)
        if clean:
            unique_words.add(clean)
            total_words += 1
    if total_words == 0:
        return 0
    return len(unique_words) / total_words


def exactly_once_to_total(text):
    '''
    text is a string of text.
    
    Return the number of words that show up exactly once in text 
    divided by the total number of words in text.
    Do not count empty words as words.
    Do not include surrounding punctuation.
    
    >>> exactly_once_to_total('A pearl! Pearl! Lustrous pearl! \
    Rare. What a nice find.')
    0.5
    '''
    words = text.split()
    word_count = {}
    total_words = 0
    for word in words:
        clean = clean_word(word)
        if clean:
            if clean in word_count:
                word_count[clean] += 1
            else:
                word_count[clean] = 1
            total_words += 1
    if total_words == 0:
        return 0
    exactly_once = sum(1 for count in word_count.values() if count == 1)
    return exactly_once / total_words


def split_string(text, separators):
    '''
    text is a string of text.
    separators is a string of separator characters.
    
    Split the text into a list using any of the one-character 
    separators and return the result.
    Remove spaces from beginning and end 
    of a string before adding it to the list.
    Do not include empty strings in the list.

    >>> split_string('one*two[three', '*[')
    ['one', 'two', 'three']
    >>> split_string('A pearl! Pearl! Lustrous pearl! Rare. \
        What a nice find.', '.?!')
    ['A pearl', 'Pearl', 'Lustrous pearl', 'Rare', \
    'What a nice find']

    '''
    if not separators:
        return [text.strip()] if text.strip() else []
    import re
    pattern = f"[{re.escape(separators)}]"
    parts = re.split(pattern, text)
    return [part.strip() for part in parts if part.strip()]


def get_sentences(text):
    '''
    text is a string of text.
    
    Return a list of the sentences from text.
    Sentences are separated by a '.', '?' or '!'

    >>> get_sentences('A pearl! Pearl! Lustrous pearl! Rare. \
    What a nice find.')
    ['A pearl', 'Pearl', 'Lustrous pearl', 'Rare', \
    'What a nice find']
    '''
    sentences = split_string(text, '.?!')
    return [sentence.strip() for sentence in sentences if sentence.strip()]

def average_sentence_length(text):
    '''
    text is a string of text.
    
    Return the average number of words per sentence in text. 
    Do not count empty words as words.
    
    >>> average_sentence_length('A pearl! Pearl! Lustrous pearl! Rare. What a nice find.')
    2.0
    '''
    sentences = get_sentences(text)
    total_words = 0
    for sentence in sentences:
        words = sentence.split()
        total_words += len([word for word in words if clean_word(word)])
    if len(sentences) == 0:
        return 0
    return total_words / len(sentences)


def get_phrases(text):
    '''
    sentence is a sentence string.
    
    Return a list of the phrases from sentence.
    Phrases are separated by a ',', ';' or ':'

    >>> get_phrases('Lustrous pearl, Rare, What a nice find')
    ['Lustrous pearl', 'Rare', 'What a nice find']
    '''
    phrases = split_string(text, ',;:')
    return [phrase.strip() for phrase in phrases if phrase.strip()]


def average_sentence_complexity(text):
    '''
    text is a string of text.
    
    Return the average number of phrases per sentence in text.
    
    >>> average_sentence_complexity('A pearl! Pearl! Lustrous \
    pearl! Rare. What a nice find.')
    1.0
    >>> average_sentence_complexity('A pearl! Pearl! Lustrous \
    pearl! Rare, what a nice find.')
    1.25
    '''
    sentences = get_sentences(text)
    total_phrases = 0
    for sentence in sentences:
        phrases = get_phrases(sentence)
        total_phrases += len(phrases)
    if len(sentences) == 0:
        return 0
    return total_phrases / len(sentences)


def make_signature(text):
    '''
    The signature for text is a list of five elements:
    average word length, different words divided by total words, words used
    exactly once divided by total words, average sentence length, and average sentence complexity.
    
    Return the signature for text.
    
    >>> make_signature('A pearl! Pearl! Lustrous pearl! \
    Rare, what a nice find.')
    [4.1, 0.7, 0.5, 2.5, 1.25]
    '''
    return [
        average_word_length(text),
        different_to_total(text),
        exactly_once_to_total(text),
        average_sentence_length(text),
        average_sentence_complexity(text)
    ]


def get_all_signatures(known_dir):
    '''
    known_dir is the name of a directory of books.
    For each file in directory known_dir, determine its signature.
    
    Return a dictionary where each key is
    the name of a file, and the value is its signature.
    '''
    signatures = {}
    for filename in os.listdir(known_dir):
        if filename.endswith('.txt'):
            with open(os.path.join(known_dir, filename), 'r', encoding='utf-8') as file:
                text = file.read()
                signatures[filename] = make_signature(text)
    return signatures


def get_score(signature1, signature2, weights):
    '''
    signature1 and signature2 are signatures.
    weights is a list of five weights.
    
    Return the score for signature1 and signature2.
    
    >>> get_score([4.6, 0.1, 0.05, 10, 2],
    ...           [4.3, 0.1, 0.04, 16, 4],
    ...           [11, 33, 50, 0.4, 4])
    14.2
    '''
    score = 0
    for i in range(len(signature1)):
        score += abs(signature1[i] - signature2[i]) * weights[i]
    return score


def lowest_score(signatures_dict, unknown_signature, weights):
    '''
    signatures_dict is a dictionary mapping keys to signatures.
    unknown_signature is a signature.
    weights is a list of five weights.

    Return the key whose signature value has the lowest 
    score with unknown_signature.

    >>> d = {'Dan': [1, 1, 1, 1, 1],
    ...      'Leo': [3, 3, 3, 3, 3]}
    >>> unknown = [1, 0.8, 0.9, 1.3, 1.4]
    >>> weights = [11, 33, 50, 0.4, 4]
    >>> lowest_score(d, unknown, weights)
    'Dan'
    '''
    lowest_key = None
    lowest_value = float('inf')
    for key, signature in signatures_dict.items():
        score = get_score(signature, unknown_signature, weights)
        if score < lowest_value:
            lowest_value = score
            lowest_key = key
    return lowest_key


def process_data(mystery_filename, known_dir):
    '''
    mystery_filename is the filename of a mystery book whose
    author we want to know.
    known_dir is the name of a directory of books.

    Return the name of the signature closest to
    the signature of the text of mystery_filename.
    '''
    with open(mystery_filename, 'r', encoding='utf-8') as file:
        mystery_text = file.read()
    mystery_signature = make_signature(mystery_text)
    signatures_dict = get_all_signatures(known_dir)
    weights = [11, 33, 50, 0.4, 4]  # Example weights
    return lowest_score(signatures_dict, mystery_signature, weights)


def make_guess(known_dir):
    '''
    Ask user for a filename.
    Get all known signatures from known_dir,
    and print the name of the one that has the lowest score
    with the user's filename.
    '''
    print("Welcome to the Authorship Identifier!\n")
    print("NOTE: known_authors and mystery_texts directories are under data/")
    print("For example, data/mystery_texts/unknown1.txt\n")

    mystery_filename = input("Enter the filename of the mystery book: ").strip()
    print("Comparing with known authors...\n")
    if not os.path.isfile(mystery_filename):
        print(f"File {mystery_filename} does not exist.")
        return
    guess = process_data(mystery_filename, known_dir)
    print("Analysis complete!")
    if guess:
        print(f"The author of the mystery book is likely: {guess}")
    else:
        print("No matching author found.")


if __name__ == "__main__":
    make_guess('data/known_authors')
