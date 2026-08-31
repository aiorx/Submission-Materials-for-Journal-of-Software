from collections import defaultdict
import sys
import re

# Produced using common development resources


def clean_text(text):
    # Keep only letters, convert to lowercase
    return re.sub(r"[^a-z]", "", text.lower())


def generate_ngrams(text, n=2):
    ngram_counts = defaultdict(int)
    total = 0

    for i in range(len(text) - n + 1):
        ngram = text[i : i + n]
        if len(ngram) == n:  # Just in case
            ngram_counts[ngram] += 1
            total += 1

    # Normalize frequencies
    ngram_freqs = {ng: count / total for ng, count in ngram_counts.items()}
    return ngram_freqs


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_ngrams.py input.txt [n]")
        sys.exit(1)

    filename = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 2

    with open(filename, "r", encoding="utf-8") as f:
        raw_text = f.read()

    cleaned = clean_text(raw_text)
    freqs = generate_ngrams(cleaned, n)

    # Print as C-style table
    if n == 2:
        print("const double bigram_table[26][26] = {")
        for i in range(26):
            row = []
            for j in range(26):
                bigram = chr(i + ord("a")) + chr(j + ord("a"))
                freq = freqs.get(bigram, 0.0)
                row.append(f"{freq:.8f}")
            print("    {" + ", ".join(row) + "},")
        print("};")
    else:
        for ng, freq in sorted(freqs.items(), key=lambda x: -x[1])[:50]:
            print(f"{ng}: {freq:.8f}")


if __name__ == "__main__":
    main()
