```python
def _setup(self, data):
    output = []
    for item in tqdm(data):
        output_item = {}
        text = item["content"]
        if not text or not item["entity"]:
            continue
        prompt = "".join([f"{entity}{self.mask_symbol}" for entity in item["entity"]])
        inputs = self.tokenizer.__call__(text=text, text_pair=prompt, add_special_tokens=True, max_length=self.hparams.max_length, truncation="only_first")
        inputs["is_masked"] = [int(i == self.tokenizer.mask_token_id) for i in inputs["input_ids"]]
        inputs["first_mask"] = [int(i == 0) for i in inputs["token_type_ids"]]
        output_item["inputs"] = inputs
        if isinstance(item["entity"], dict):
            labels = list(map(lambda x: x + 2, item["entity"].values()))
            output_item["labels"] = labels
        output.append(output_item)
    return output
```