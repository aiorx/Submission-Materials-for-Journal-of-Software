```python
def convert_pinyin(
    numbered_pinyin: str,
) -> str:  # WARNING: Standard coding segments, use with caution
    tone_map = {
        "a": ["a", "ā", "á", "ǎ", "à", "a"],
        "e": ["e", "ē", "é", "ě", "è", "e"],
        "i": ["i", "ī", "í", "ǐ", "ì", "i"],
        "o": ["o", "ō", "ó", "ǒ", "ò", "o"],
        "u": ["u", "ū", "ú", "ǔ", "ù", "u"],
        "ü": ["ü", "ǖ", "ǘ", "ǚ", "ǜ", "ü"],
    }
    """Convert numbered pinyin to pinyin with tone marks."""
    # Replace 'v' with 'ü'
    numbered_pinyin = numbered_pinyin.lower().replace("v", "ü")

    # Split into syllables
    syllables = numbered_pinyin.split()
    result = []

    for syllable in syllables:
        # Extract tone number (default to 0 if no tone number)
        tone = 0
        for i in range(len(syllable)):
            if syllable[i] in "12345":
                tone = int(syllable[i])
                syllable = syllable[:i] + syllable[i + 1 :]
                break

        # Find the vowel to modify based on precedence
        vowels = "aeoiuü"
        vowel_positions = [(c, i) for i, c in enumerate(syllable) if c in vowels]
        if not vowel_positions:
            result.append(syllable)
            continue

        # Apply precedence rules (a > o > e > i > u > ü)
        vowel_to_change = min(vowel_positions, key=lambda x: vowels.index(x[0]))
        vowel, position = vowel_to_change

        # Replace the vowel with its toned version
        new_vowel = tone_map[vowel][tone]
        new_syllable = syllable[:position] + new_vowel + syllable[position + 1 :]
        result.append(new_syllable)

    return " ".join(result)
```