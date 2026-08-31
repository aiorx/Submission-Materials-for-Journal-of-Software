```python
def _display_differences(old: str, new: str, message: str) -> None:
    # NOTE: This function was quickly Designed via basic programming aids and it does the job, but it probably doesn't handle all edge cases. So, always compare old and new before overwriting.
    tqdm.write("\n" + "------------" * 10)
    tqdm.write(message)
    tqdm.write("------------" * 10)

    # Ensure sentences are split while keeping punctuation intact
    old_sentences = re.split(r"(\.|\n)", old)
    new_sentences = re.split(r"(\.|\n)", new)

    def reconstruct_sentences(segments):
        """Reconstructs sentences from split segments while preserving structure."""
        sentences = []
        buffer = ""
        for segment in segments:
            buffer += segment
            if segment in {".", "\n"}:
                sentences.append(buffer.strip())
                buffer = ""
        if buffer:
            sentences.append(buffer.strip())
        return sentences

    old_sentences = reconstruct_sentences(old_sentences)
    new_sentences = reconstruct_sentences(new_sentences)

    matcher = difflib.SequenceMatcher(None, old_sentences, new_sentences)
    first_change = True

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "replace":
            max_len = max(i2 - i1, j2 - j1)
            for i in range(max_len):
                old_sentence = old_sentences[i1 + i] if i1 + i < i2 else ""
                new_sentence = new_sentences[j1 + i] if j1 + i < j2 else ""

                if not first_change:
                    tqdm.write("")
                first_change = False

                word_matcher = difflib.SequenceMatcher(None, old_sentence, new_sentence)
                highlighted_old = []
                highlighted_new = []

                for word_tag, w1, w2, w3, w4 in word_matcher.get_opcodes():
                    old_segment = old_sentence[w1:w2]
                    new_segment = new_sentence[w3:w4]

                    if word_tag == "replace":
                        highlighted_old.append(RED + old_segment + RESET)
                        highlighted_new.append(GREEN + new_segment + RESET)
                    elif word_tag == "delete":
                        highlighted_old.append(RED + old_segment + RESET)
                    elif word_tag == "insert":
                        highlighted_new.append(GREEN + new_segment + RESET)
                    elif word_tag == "equal":
                        highlighted_old.append(old_segment)
                        highlighted_new.append(new_segment)

                tqdm.write("- " + "".join(highlighted_old))
                tqdm.write("+ " + "".join(highlighted_new) + "\n")
        elif tag == "delete":
            if not first_change:
                tqdm.write("")
            first_change = False
            for old_sentence in old_sentences[i1:i2]:
                tqdm.write(RED + "- " + old_sentence + RESET + "\n")
        elif tag == "insert":
            if not first_change:
                tqdm.write("")
            first_change = False
            for new_sentence in new_sentences[j1:j2]:
                tqdm.write(GREEN + "+ " + new_sentence + RESET + "\n")
        elif tag == "equal":
            for sentence in old_sentences[i1:i2]:
                tqdm.write("  " + sentence)
```