```python
def eval(context, question):
    with open(os.path.join(config.data_dir, "train", "word2idx.pkl"), "rb") as wi, \
         open(os.path.join(config.data_dir, "train", "char2idx.pkl"), "rb") as ci, \
         open(os.path.join(config.data_dir, "train", "word_embeddings.pkl"), "rb") as wb, \
         open(os.path.join(config.data_dir, "train", "char_embeddings.pkl"), "rb") as cb:
        word2idx = pickle.load(wi)
        char2idx = pickle.load(ci)
        word_embedding_matrix = pickle.load(wb)
        char_embedding_matrix = pickle.load(cb)

    # transform them into Tensors
    word_embedding_matrix = torch.from_numpy(np.array(word_embedding_matrix)).type(torch.float32)
    char_embedding_matrix = torch.from_numpy(np.array(char_embedding_matrix)).type(torch.float32)
    idx2word = dict([(y, x) for x, y in word2idx.items()])

    context = clean_text(context)
    context = [w for w in word_tokenize(context) if w]

    question = clean_text(question)
    question = [w for w in word_tokenize(question) if w]

    if len(context) > config.max_len_context:
        print("The context is too long. Maximum accepted length is", config.max_len_context, "words.")
    if max([len(w) for w in context]) > config.max_len_word:
        print("Some words in the context are longer than", config.max_len_word, "characters.")
    if len(question) > config.max_len_question:
        print("The question is too long. Maximum accepted length is", config.max_len_question, "words.")
    if max([len(w) for w in question]) > config.max_len_word:
        print("Some words in the question are longer than", config.max_len_word, "characters.")
    if len(question) < 3:
        print("The question is too short. It needs to be at least a three words question.")

    context_idx = np.zeros([config.max_len_context], dtype=np.int32)
    question_idx = np.zeros([config.max_len_question], dtype=np.int32)
    context_char_idx = np.zeros([config.max_len_context, config.max_len_word], dtype=np.int32)
    question_char_idx = np.zeros([config.max_len_question, config.max_len_word], dtype=np.int32)

    # replace 0 values with word and char IDs
    for j, word in enumerate(context):
        if word in word2idx:
            context_idx[j] = word2idx[word]
        else:
            context_idx[j] = 1
        for k, char in enumerate(word):
            if char in char2idx:
                context_char_idx[j, k] = char2idx[char]
            else:
                context_char_idx[j, k] = 1

    for j, word in enumerate(question):
        if word in word2idx:
            question_idx[j] = word2idx[word]
        else:
            question_idx[j] = 1
        for k, char in enumerate(word):
            if char in char2idx:
                question_char_idx[j, k] = char2idx[char]
            else:
                question_char_idx[j, k] = 1

    model = BiDAF(word_vectors=word_embedding_matrix,
                  char_vectors=char_embedding_matrix,
                  hidden_size=config.hidden_size,
                  drop_prob=config.drop_prob)
    try:
        if config.cuda:
            model.load_state_dict(torch.load(os.path.join(config.squad_models, "model_final.pkl"))["state_dict"])
        else:
            model.load_state_dict(torch.load(os.path.join(config.squad_models, "model_final.pkl"),
                                             map_location=lambda storage, loc: storage)["state_dict"])
        print("Model weights successfully loaded.")
    except:
        pass
        print("Model weights not found, initialized model with random weights.")
    model.to(device)
    model.eval()
    with torch.no_grad():
        context_idx, context_char_idx, question_idx, question_char_idx = torch.tensor(context_idx, dtype=torch.int64).unsqueeze(0).to(device),\
                    torch.tensor(context_char_idx, dtype=torch.int64).unsqueeze(0).to(device),\
                    torch.tensor(question_idx, dtype=torch.int64).unsqueeze(0).to(device),\
                    torch.tensor(question_char_idx, dtype=torch.int64).unsqueeze(0).to(device)

        start_scores, end_scores = model(context_idx, context_char_idx, question_idx, question_char_idx)
        start_idx = torch.argmax(start_scores)
        end_idx = torch.argmax(end_scores)
        if end_idx < start_idx:
            end_idx = start_idx

        answer = context[start_idx:end_idx + 1]
        answer = " ".join(answer)
        return answer
```