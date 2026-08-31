```python
def _get_text(self, video_id, sub_id):
    data_dict = self.data_dict[video_id]
    k = 1
    r_ind = [sub_id]

    starts = np.zeros(k)
    ends = np.zeros(k)
    pairs_text = np.zeros((k, self.max_words), dtype=np.long)
    pairs_mask = np.zeros((k, self.max_words), dtype=np.long)
    pairs_segment = np.zeros((k, self.max_words), dtype=np.long)
    pairs_masked_text = np.zeros((k, self.max_words), dtype=np.long)
    pairs_token_labels = np.zeros((k, self.max_words), dtype=np.long)

    pairs_input_caption_ids = np.zeros((k, self.max_words), dtype=np.long)
    pairs_output_caption_ids = np.zeros((k, self.max_words), dtype=np.long)
    pairs_decoder_mask = np.zeros((k, self.max_words), dtype=np.long)

    for i in range(k):
        ind = r_ind[i]
        start_, end_ = data_dict['start'][ind], data_dict['end'][ind]
        starts[i], ends[i] = start_, end_
        total_length_with_CLS = self.max_words - 1
        words = self.tokenizer.tokenize(data_dict['transcript'][ind])

        words = ["[CLS]"] + words
        if len(words) > total_length_with_CLS:
            words = words[:total_length_with_CLS]
        words = words + ["[SEP]"]

        # Mask Language Model <-----
        token_labels = []
        masked_tokens = words.copy()
        for token_id, token in enumerate(masked_tokens):
            if token_id == 0 or token_id == len(masked_tokens) - 1:
                token_labels.append(-1)
                continue
            prob = random.random()
            # mask token with 15% probability
            if prob < 0.15:
                prob /= 0.15

                # 80% randomly change token to mask token
                if prob < 0.8:
                    masked_tokens[token_id] = "[MASK]"

                # 10% randomly change token to random token
                elif prob < 0.9:
                    masked_tokens[token_id] = random.choice(list(self.tokenizer.vocab.items()))[0]

                # -> rest 10% randomly keep current token

                # append current token to output (we will predict these later)
                try:
                    token_labels.append(self.tokenizer.vocab[token])
                except KeyError:
                    token_labels.append(-1)
            else:
                token_labels.append(-1)

        # Convert tokens to ids
        input_caption_ids = [self.tokenizer.vocab.get(t, self.tokenizer.vocab.get("[UNK]")) for t in masked_tokens]
        output_caption_ids = [self.tokenizer.vocab.get(t, self.tokenizer.vocab.get("[UNK]")) for t in words]

        # Padding
        length = len(input_caption_ids)
        pairs_input_caption_ids[i, :length] = input_caption_ids
        pairs_output_caption_ids[i, :length] = output_caption_ids
        pairs_token_labels[i, :length] = token_labels
        pairs_mask[i, :length] = 1

    return {
        "starts": starts,
        "ends": ends,
        "input_caption_ids": pairs_input_caption_ids,
        "output_caption_ids": pairs_output_caption_ids,
        "token_labels": pairs_token_labels,
        "mask": pairs_mask,
    }
```