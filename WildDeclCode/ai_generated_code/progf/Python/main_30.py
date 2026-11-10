#!/usr/bin/env python
# coding: utf-8

# ## Part I: Data Pre-processing

# In[5]:


import pandas as pd


# In[8]:


# Download the Google Analogy dataset
get_ipython().system('wget http://download.tensorflow.org/data/questions-words.txt')


# In[9]:


# Preprocess the dataset
file_name = "questions-words"
with open(f"{file_name}.txt", "r") as f:
    data = f.read().splitlines()


# In[11]:


# check data from the first 10 entries
for entry in data[:10]:
    print(entry)


# In[12]:


# TODO1: Write your code here for processing data to pd.DataFrame
# Please note that the first five mentions of ": " indicate `semantic`,
# and the remaining nine belong to the `syntatic` category.
questions = []
categories = []
sub_categories = []
prev_cat = ""
count = 0
for entry in data:
    if entry.startswith(':'):
        count += 1
        prev_cat = entry
    else:
        questions.append(entry)
        if count > 5:
          categories.append('Syntatic')
        else:
          categories.append('Semantic')
        sub_categories.append(prev_cat)


# In[13]:


# Create the dataframe
df = pd.DataFrame(
    {
        "Question": questions,
        "Category": categories,
        "SubCategory": sub_categories,
    }
)


# In[14]:


df.head()


# In[15]:


df.to_csv(f"{file_name}.csv", index=False)


# ## Part II: Use pre-trained word embeddings
# - After finish Part I, you can run Part II code blocks only.

# In[3]:


import pandas as pd
import numpy as np
import gensim.downloader
from tqdm import tqdm
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE


# In[23]:


data = pd.read_csv("questions-words.csv")


# In[24]:


MODEL_NAME = "glove-wiki-gigaword-100"
# You can try other models.
# https://radimrehurek.com/gensim/models/word2vec.html#pretrained-models

# Load the pre-trained model (using GloVe vectors here)
model = gensim.downloader.load(MODEL_NAME)
print("The Gensim model loaded successfully!")


# In[25]:


# Do predictions and preserve the gold answers (word_D)
preds = []
golds = []

for analogy in tqdm(data["Question"]):
      # TODO2: Write your code here to use pre-trained word embeddings for getting predictions of the analogy task.
      # You should also preserve the gold answers during iterations for evaluations later.
      """ Hints
      # Unpack the analogy (e.g., "man", "woman", "king", "queen")
      # Perform vector arithmetic: word_b + word_c - word_a should be close to word_d
      # Source: https://github.com/piskvorky/gensim/blob/develop/gensim/models/keyedvectors.py#L776
      # Mikolov et al., 2013: big - biggest and small - smallest
      # Mikolov et al., 2013: X = vector(”biggest”) − vector(”big”) + vector(”small”).
      """
      word_a, word_b, word_c, word_d = analogy.split()
      try:
          # reference: https://github.com/piskvorky/gensim/blob/develop/gensim/models/keyedvectors.py#L776
          predicted_word = model.most_similar(positive=[word_b, word_c], negative=[word_a], topn=1)[0][0]

          preds.append(predicted_word)
          golds.append(word_d)
      except KeyError:
          preds.append(None)
          golds.append(word_d)


# In[27]:


# Perform evaluations. You do not need to modify this block!!

def calculate_accuracy(gold: np.ndarray, pred: np.ndarray) -> float:
    return np.mean(gold == pred)

golds_np, preds_np = np.array(golds), np.array(preds)
data = pd.read_csv("questions-words.csv")

# Evaluation: categories
for category in data["Category"].unique():
    mask = data["Category"] == category
    golds_cat, preds_cat = golds_np[mask], preds_np[mask]
    acc_cat = calculate_accuracy(golds_cat, preds_cat)
    print(f"Category: {category}, Accuracy: {acc_cat * 100}%")

# Evaluation: sub-categories
for sub_category in data["SubCategory"].unique():
    mask = data["SubCategory"] == sub_category
    golds_subcat, preds_subcat = golds_np[mask], preds_np[mask]
    acc_subcat = calculate_accuracy(golds_subcat, preds_subcat)
    print(f"Sub-Category{sub_category}, Accuracy: {acc_subcat * 100}%")


# In[28]:


# Collect words from Google Analogy dataset
SUB_CATEGORY = ": family"

# TODO3: Plot t-SNE for the words in the SUB_CATEGORY `: family`
words = []
mask = data['SubCategory'] == SUB_CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]

words = list(set(words))
valid_words = [word for word in words if word in model]
word_vectors = np.array([model[word] for word in valid_words])

# Reference: https://scikit-learn.org/dev/modules/generated/sklearn.manifold.TSNE.html
tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)

# These two lines are Supported via standard programming aids
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# ### Part III: Train your own word embeddings

# ### Get the latest English Wikipedia articles and do sampling.
# - Usually, we start from Wikipedia dump (https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles.xml.bz2). However, the downloading step will take very long. Also, the cleaning step for the Wikipedia corpus ([`gensim.corpora.wikicorpus.WikiCorpus`](https://radimrehurek.com/gensim/corpora/wikicorpus.html#gensim.corpora.wikicorpus.WikiCorpus)) will take much time. Therefore, we provide cleaned files for you.

# #### Note 📓
# 
# 
# > Check the [link](https://www.youtube.com/watch?v=Mq8-WdcnzVo) for more information!
# 
# 
# - Since the files provided by the TAs cannot be downloaded directly from Colab, I downloaded the files on my computer.
# - Then, by uploading the files to my Google Drive, I was able to download them as shown below.

# In[31]:


# Download the split Wikipedia files
# Each file contain 562365 lines (articles).
get_ipython().system('gdown --id 1ZsloffhQ4fex3p7y6pvVx9WhmiSfjMgp -O wiki_texts_part_0.txt.gz')
get_ipython().system('gdown --id 1YrKZujZE8WWf4l9P9pm-9V8MgWVo6kfQ -O wiki_texts_part_1.txt.gz')
get_ipython().system('gdown --id 1cL4JEI0q-40v4UkHHAJjCzbnVdQ2FSFs -O wiki_texts_part_2.txt.gz')
get_ipython().system('gdown --id 1Ht4stLEOJJ_MyuF8_ET7xNHBZsQbYEHX -O wiki_texts_part_3.txt.gz')
get_ipython().system('gdown --id 14ZC0v2gLNmGzWyhsF053tMeiCc7NiS-s -O wiki_texts_part_4.txt.gz')


# In[32]:


# Download the split Wikipedia files
# Each file contain 562365 lines (articles), except the last file.
get_ipython().system('gdown --id 11d5LTo5sAP6RXqzMBwnw7QXMpPx9FLan -O wiki_texts_part_5.txt.gz')
get_ipython().system('gdown --id 17z2IHgXzerPM8ys2m4oSFXEOEfF18Sdf -O wiki_texts_part_6.txt.gz')
get_ipython().system('gdown --id 1dl3vLR14c3r5p34BmM4oCSR3nvpb014d -O wiki_texts_part_7.txt.gz')
get_ipython().system('gdown --id 1v6xIa8cKiYDzqW-Qgi7Wve0XV48zOa5l -O wiki_texts_part_8.txt.gz')
get_ipython().system('gdown --id 1cOVI0IW7KQUb2jec-4DARC_9abTqvIz0 -O wiki_texts_part_9.txt.gz')
get_ipython().system('gdown --id 14K-i35WR84I8rYcnQGPttIHCYQoJbHUg -O wiki_texts_part_10.txt.gz')


# In[33]:


# Extract the downloaded wiki_texts_parts files.
get_ipython().system('gunzip wiki_texts_part_*.gz')


# In[ ]:


# Combine the extracted wiki_texts_parts files.
get_ipython().system('cat wiki_texts_part_*.txt > wiki_texts_combined.txt')


# In[37]:


# Check the first ten lines of the combined file
get_ipython().system('head -n 10 wiki_texts_combined.txt')


# Please note that we used the default parameters of [`gensim.corpora.wikicorpus.WikiCorpus`](https://radimrehurek.com/gensim/corpora/wikicorpus.html#gensim.corpora.wikicorpus.WikiCorpus) for cleaning the Wiki raw file. Thus, words with one character were discarded.

# In[39]:


# Now you need to do sampling because the corpus is too big.
# You can further perform analysis with a greater sampling ratio.

import random

wiki_txt_path = "wiki_texts_combined.txt"
output_path = "output_20.txt"
# wiki_texts_combined.txt is a text file separated by linebreaks (\n).
# Each row in wiki_texts_combined.txt indicates a Wikipedia article.

# Reference:
# https://damor.dev/your-session-crashed-after-using-all-available-ram-google-colab/?source=post_page-----e31f6a192d52--------------------------------
# https://www.w3schools.com/python/python_file_write.asp

# TODO4: Sample `20%` Wikipedia articles
with open(wiki_txt_path, "r", encoding="utf-8") as f:
    with open(output_path, "w", encoding="utf-8") as output_file:
        batch_size = 1000000
        batch = f.readlines(batch_size)
        while batch:
            sample_size = int(len(batch) * 0.2)
            output_file.write("".join(random.sample(batch, sample_size)))
            batch = f.readlines(batch_size)


# In[ ]:


# # TODO5: Train your own word embeddings with the sampled articles
# # https://radimrehurek.com/gensim/models/word2vec.html#gensim.models.word2vec.Word2Vec
# # Hint: You should perform some pre-processing before training.
import re
from gensim.models import Word2Vec
from tqdm import tqdm
from sklearn.feature_extraction.text import CountVectorizer
import os

count_vect = CountVectorizer()
analyze = count_vect.build_analyzer()

def pre_process(line):
    # Remove punctuation and tokenize
    line = re.sub(r"[^\w\s]", "", line)
    # Tokenization and lowercasing
    words = analyze(line)
    return words

sentences = []
batch_size = 10000
vocab_built = False

# Reference: https://radimrehurek.com/gensim/auto_examples/tutorials/run_word2vec.html
# Also, I asked ChatGPT for help on the code block below.
with open("output_20.txt", "r", encoding="utf-8") as infile:
    for line in tqdm(infile, desc="Processing lines for vocabulary build"):
        processed_line = pre_process(line)
        if processed_line:
            sentences.append(processed_line)

        if not vocab_built and len(sentences) >= batch_size:
            model = Word2Vec(vector_size=100, window=5, min_count=1, workers=4)
            model.build_vocab(sentences)
            vocab_built = True
            break

with open("output_20.txt", "r", encoding="utf-8") as infile:
    sentences = []
    for line in tqdm(infile, desc="Training model in batches", total=os.path.getsize("output_20.txt")):
        processed_line = pre_process(line)
        if processed_line:
            sentences.append(processed_line)

        if len(sentences) >= batch_size:
            model.train(sentences, total_examples=len(sentences), epochs=5)
            sentences = []

if sentences:
    model.train(sentences, total_examples=len(sentences), epochs=5)

model.save("word2vec_model.model")


# In[4]:


data = pd.read_csv("questions-words.csv")


# In[6]:


from gensim.models import Word2Vec

model = Word2Vec.load("word2vec_model.model")
# Do predictions and preserve the gold answers (word_D)
preds = []
golds = []

for analogy in tqdm(data["Question"]):
      # TODO6: Write your code here to use your trained word embeddings for getting predictions of the analogy task.
      # You should also preserve the gold answers during iterations for evaluations later.
      """ Hints
      # Unpack the analogy (e.g., "man", "woman", "king", "queen")
      # Perform vector arithmetic: word_b + word_c - word_a should be close to word_d
      # Source: https://github.com/piskvorky/gensim/blob/develop/gensim/models/keyedvectors.py#L776
      # Mikolov et al., 2013: big - biggest and small - smallest
      # Mikolov et al., 2013: X = vector(”biggest”) − vector(”big”) + vector(”small”).
      """
      word_a, word_b, word_c, word_d = analogy.split()
      try:
          # reference: https://github.com/piskvorky/gensim/blob/develop/gensim/models/keyedvectors.py#L776
          predicted_word = model.wv.most_similar(positive=[word_b, word_c], negative=[word_a], topn=1)[0][0]

          preds.append(predicted_word)
          golds.append(word_d)
      except KeyError:
          preds.append(None)
          golds.append(word_d)


# In[16]:


# Collect words from Google Analogy dataset
SUB_CATEGORY = ": family"

# TODO7: Plot t-SNE for the words in the SUB_CATEGORY `: family`
words = []
mask = data['SubCategory'] == SUB_CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]

words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])

tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# In[19]:


# Collect words from Google Analogy dataset
SUB_CATEGORY = ": gram8-plural"

words = []
mask = data['SubCategory'] == SUB_CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]
words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])


tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# In[20]:


# Collect words from Google Analogy dataset
SUB_CATEGORY = ": currency"

words = []
mask = data['SubCategory'] == SUB_CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]
words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])


tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# In[21]:


# Collect words from Google Analogy dataset
CATEGORY = "Semantic"

words = []
mask = data['Category'] == CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]
words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])


tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# In[24]:


# Collect words from Google Analogy dataset
CATEGORY = "Syntatic"

words = []
mask = data['Category'] == CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]
words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])


tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(20, 16))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")


# In[ ]:


# sampling 30%
import random
import re
from gensim.models import Word2Vec
from tqdm import tqdm
from sklearn.feature_extraction.text import CountVectorizer
import os

wiki_txt_path = "wiki_texts_combined.txt"
output_path = "output_30.txt"

with open(wiki_txt_path, "r", encoding="utf-8") as f:
    with open(output_path, "w", encoding="utf-8") as output_file:
        batch_size = 1000000
        batch = f.readlines(batch_size)
        while batch:
            sample_size = int(len(batch) * 0.3)
            output_file.write("".join(random.sample(batch, sample_size)))
            batch = f.readlines(batch_size)

count_vect = CountVectorizer()
analyze = count_vect.build_analyzer()

def pre_process(line):
    line = re.sub(r"[^\w\s]", "", line)
    words = analyze(line)
    return words

sentences = []
batch_size = 10000
vocab_built = False

with open("output_20.txt", "r", encoding="utf-8") as infile:
    for line in tqdm(infile, desc="Processing lines for vocabulary build"):
        processed_line = pre_process(line)
        if processed_line:
            sentences.append(processed_line)

        if not vocab_built and len(sentences) >= batch_size:
            model = Word2Vec(vector_size=100, window=5, min_count=1, workers=4)
            model.build_vocab(sentences)
            vocab_built = True
            break

with open("output_20.txt", "r", encoding="utf-8") as infile:
    sentences = []
    for line in tqdm(infile, desc="Training model in batches", total=os.path.getsize("output_30.txt")):
        processed_line = pre_process(line)
        if processed_line:
            sentences.append(processed_line)

        if len(sentences) >= batch_size:
            model.train(sentences, total_examples=len(sentences), epochs=5)
            sentences = []

if sentences:
    model.train(sentences, total_examples=len(sentences), epochs=5)

model.save("word2vec_model_30.model")


# In[4]:


data = pd.read_csv("questions-words.csv")

preds = []
golds = []

for analogy in tqdm(data["Question"]):
      word_a, word_b, word_c, word_d = analogy.split()
      try:
          predicted_word = model.wv.most_similar(positive=[word_b, word_c], negative=[word_a], topn=1)[0][0]

          preds.append(predicted_word)
          golds.append(word_d)
      except KeyError:
          preds.append(None)
          golds.append(word_d)

SUB_CATEGORY = ": family"

words = []
mask = data['SubCategory'] == SUB_CATEGORY
words = [word for analogy in data[mask]["Question"] for word in analogy.split()]

words = list(set(words))

valid_words = [word for word in words if word in model.wv]
word_vectors = np.array([model.wv[word] for word in valid_words])

tsne_model = TSNE(n_components=2)
word_vectors_in_2d = tsne_model.fit_transform(word_vectors)
plt.figure(figsize=(10, 8))
plt.scatter(word_vectors_in_2d[:, 0], word_vectors_in_2d[:, 1])

for i, word in enumerate(valid_words):
    plt.annotate(word, (word_vectors_in_2d[i, 0], word_vectors_in_2d[i, 1]))

plt.title("Word Relationships from Google Analogy Task")
plt.show()
plt.savefig("word_relationships.png", bbox_inches="tight")

