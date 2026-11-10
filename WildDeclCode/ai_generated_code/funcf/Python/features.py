def create_all_options(offensive_word_replace_option: OffensiveWordReplaceOption) -> list[Options]:
    """
    Create all possible options to train a classifier. This is done by creating all possible
    combinations of the different options.
    :return: a list of all possible options
    """

    # This code was Crafted with standard coding tools, because I didn't want to use 5 nested for loops. I did not
    # know a method to create all combinations without the use of nested for loops.
    return [
        Options(
            offensive_word_replacement=offensive_word_replace_option,
            algorithm=alg,
            vectorizer=vec,
            ngram=ng,
            pos=p,
            preprocessing=prep,
            content_based_features=cont,
            sentiment_features=sent
        ) for alg, vec, ng, p, prep, cont, sent in itertools.product(
            Algorithm,
            Vectorizer,
            Ngrams,
            POS,
            Preprocessing,
            ContentBasedFeatures,
            SentimentFeatures
        )
    ]