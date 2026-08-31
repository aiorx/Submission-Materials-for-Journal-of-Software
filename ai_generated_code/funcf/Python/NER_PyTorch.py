```python
        with open(path_to_output, 'w+', encoding='utf-8') as file:
            for batch in batch_sentences:
                encoding = tokenizer(batch, max_length=512, padding=True, truncation=True, 
                                    return_tensors="pt", is_split_into_words=True, stride=50)
                input_ids, attention_mask = encoding['input_ids'].to(device), encoding['attention_mask'].to(device)

                with torch.no_grad():
                    outputs = model(input_ids, attention_mask=attention_mask)
                    predictions = torch.argmax(outputs.logits, dim=-1)

                for i, (sentence, preds) in enumerate(zip(batch, predictions)):
                    word_ids = encoding.word_ids(batch_index=i)  # map subwords to words
                    previous_word_id = None
                    word_preds = {}

                    for token_idx, word_id in enumerate(word_ids):
                        if word_id is None:
                            continue  # skip special tokens

                        if word_id != previous_word_id:  # first subword of the word
                            word_preds[word_id] = id2label.get(preds[token_idx].item(), "O")

                        previous_word_id = word_id  # track word ID for subword aggregation

                    # Write output
                    for idx, word in enumerate(sentence):
                        label = word_preds.get(idx, "O")  # default to 'O' if missing
                        file.write(f"{word}\t{label}\n")
                    file.write("\n")
```