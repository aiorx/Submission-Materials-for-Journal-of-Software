```python
def colorize_text(sentence, weights):
    # Composed with basic coding tools
    colored_sentence = ""
    min_weight = min(weights)
    max_weight = max(weights)

    for word, weight in zip(sentence.split(), weights):
        # Normalize the weight to the range [0, 1]
        normalized_weight = (weight - min_weight) / (max_weight - min_weight)

        # Calculate the color based on the normalized weight
        red = int((1 - normalized_weight) * 255)
        green = int(normalized_weight * 255)
        blue = 0

        # Create the colored word using the RGB color values
        colored_word = f"\033[38;2;{red};{green};{blue}m{word}\033[0m"

        # Append the colored word to the colored sentence
        colored_sentence += colored_word + " "

    return colored_sentence.strip()
```