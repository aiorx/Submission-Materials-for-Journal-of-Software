```python
class ChatBot(AutoRegressiveDecoder):
    """基于随机采样的文本续写
    """
    @AutoRegressiveDecoder.wraps(default_rtype='probas')
    def predict(self, inputs, output_ids, states):
        token_ids = np.concatenate([inputs[0], output_ids], 1)
        return model.predict(token_ids)[:, -1]

    def response(self, text, n=1, topp=0.95):
        """输出结果会有一定的随机性
        """
        token_ids, _ = tokenizer.encode(text)
        results = self.random_sample([token_ids],
                                     n,
                                     topp=topp)  # 基于随机采样
        # results = [token_ids + [int(i) for i in ids] for ids in results]
        texts = [tokenizer.decode(ids) for ids in results]
        return texts
```