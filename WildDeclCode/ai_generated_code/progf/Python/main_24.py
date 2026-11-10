# Magic The Gathering Natural Language Query Example

import torch
from transformers import BertTokenizer, BertModel
import faiss 
import numpy as np


# This example utilizes a Bert Model and Tokenizer to generate embeddings for an array of Magic The Gathering
# 'Oracle Texts'. We're using PyTorch/BERT to generate embeddings and tensors from our cards and query. We
# then create a Facebook AI Similarity Search (FAISS) Index which we can then use to quickly find nearest neighbors
# of our query relative to the embeddings of our cards data set. 


# Array of 'Oracle Texts' from various magic the gathering cards, I know nothing about MTG so these were Supported via standard programming aids
# but regardless if these are real cards or not, they'll work for this example!
cards = [
    # Creature Cards
    "Flying. When Angel of Serenity leaves the battlefield, return the exiled cards to their owners' hands.",
    "Trample, haste. If you would draw a card, instead reveal the top three cards of your library, then put all creature cards revealed this way into your hand and the rest on the bottom of your library in any order.",
    "Deathtouch. Lifelink. Other creatures you control have deathtouch and lifelink.",
    "Whenever you cast an Elf spell, you may create a 1/1 green Elf Warrior creature token.",
    "At the beginning of your upkeep, sacrifice a creature. You gain life equal to that creature's toughness.",

    # Instant Cards
    "Counter target spell. Its controller pays 3 life.",
    "Target creature gets +3/+3 and gains flying until end of turn.",
    "Destroy target artifact. It can't be regenerated.",
    "Target player draws two cards.",
    "Exile target creature. Its controller gains life equal to its power.",

    # Sorcery Cards
    "Destroy all creatures. They can't be regenerated.",
    "Search your library for a card, then shuffle your library and put that card on top of it.",
    "Each player discards their hand, then draws seven cards.",
    "Deal 3 damage to any target. You gain 3 life.",
    "Return target creature card from your graveyard to the battlefield.",

    # Enchantment Cards
    "At the beginning of each player's draw step, that player draws an additional card.",
    "Creatures you control get +1/+1.",
    "Whenever a creature enters the battlefield under your control, you may gain 1 life.",
    "At the beginning of your upkeep, you may put a charge counter on target artifact.",
    "Each creature assigns combat damage equal to its toughness rather than its power.",

    # Artifact Cards
    "At the beginning of your upkeep, you may put a charge counter on this artifact.",
    "Tapped: Add one mana of any color.",
    "Equipped creature gets +2/+2 and has trample and lifelink.",
    "Whenever a player casts a spell, you may put a charge counter on this artifact.",
    "Tapped: Draw a card, then discard a card."
]

# This is a simple natural language query like we might expect a user to input.
query = "I'm looking for a card that can destroy all creatures."


# Load the pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
model.eval()

# Create a matrix to hold our embeddings
embeddings_matrix = []

# Encode each card and store in the matrix
for card in cards:
    input_ids = torch.tensor(tokenizer.encode(card, add_special_tokens=True)).unsqueeze(0)
    with torch.no_grad():
        embeddings = model(input_ids)[0].squeeze(0)
        vector = torch.mean(embeddings, dim=0)
    embeddings_matrix.append(vector.numpy())

# Convert the list of embeddings into a numpy array for use with FAISS
embeddings_matrix = np.array(embeddings_matrix).astype('float32')

# Build the FAISS index
d = embeddings_matrix.shape[1]  # dimensionality of the vectors
index = faiss.IndexFlatL2(d)    # Use the L2 norm for the distance metric
index.add(embeddings_matrix)    # Add vectors to the index

# Encode the query using BERT
input_ids = torch.tensor(tokenizer.encode(query, add_special_tokens=True)).unsqueeze(0)
with torch.no_grad():
    embeddings = model(input_ids)[0].squeeze(0)
    query_embedding = torch.mean(embeddings, dim=0)

# Perform the search
k = 5  # number of nearest neighbors (how many 'similar' cards we want to return)
query_embedding_np = query_embedding.numpy().reshape(1, -1).astype('float32')
distances, indices = index.search(query_embedding_np, k)

# Print the top k most similar cards
print(f"The top {k} most similar cards to '{query}' are: \n")
for idx in indices[0]:
    print(cards[idx])