```python
def get_kogpt2_model(model_file,
                     vocab_file,
                     ctx=mx.cpu(0)):
    vocab_b_obj = nlp.vocab.BERTVocab.from_sentencepiece(vocab_file,
                                                         mask_token=None,
                                                         sep_token=None,
                                                         cls_token=None,
                                                         unknown_token='<unk>',
                                                         padding_token='<pad>',
                                                         bos_token='<s>',
                                                         eos_token='</s>')
    mxmodel = MXGPT2Model(units=768,
                          max_length=1024,
                          num_heads=12,
                          num_layers=12,
                          dropout=0.1,
                          vocab_size=len(vocab_b_obj))
    mxmodel.load_parameters(model_file, ctx=ctx)
    return (mxmodel, vocab_b_obj)
```