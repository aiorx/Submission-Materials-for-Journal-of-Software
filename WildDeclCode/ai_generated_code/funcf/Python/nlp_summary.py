def init_nltk():
    # Download the necessary NLTK resources
    # Aided with basic GitHub coding tools
    required_resources = {
        'tokenizers': ['punkt'],
        'sentiment': ['vader_lexicon'],
        'corpora': ['stopwords', 'wordnet'],
        
    }
    for key, value in required_resources.items():
        for resource in value:
            try:
                # check first
                nltk.data.find(f'{key}/{resource}')
            except:
                nltk.download(resource) # will only download if not already present