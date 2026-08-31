```python
def plotNeighbours(model, words, k=10, method="TSNE", draggable=False, *args, **kwargs):
    """plotNeighbours Plot and color the `k` nearest neighbors for each word in 2-dimension 

    Create a Matplotlib plot to display word embeddings and their k-nearest neighbors in 2 dimensions, using a specified dimensionality reduction method (`method`) if the word vectors have more than 2 dimensions.
    Set`draggable` to `True` for a draggable legend in the resulting plot. 
    
    Any other parameters specified using `*args` or `**kwargs` is unpacked and passed on to the underlying dimensionality reduction method in `sklearn`.

    :param model: An instance of Word2Vec
    :type model: Word2Vec
    :param words: List of words to render in plot
    :type words: list
    :param k: Number of neighbors to plot, defaults to 10
    :type k: int, optional
    :param method: Method for dimensionality reduction, defaults to "TSNE"
    :type method: str, optional
    :param draggable: Enable draggable legend, defaults to False
    :type draggable: bool, optional
    :return: A matplotlib figure
    :raises AssertionError: Ensure `model` is size 2 (2-dimension word vectors) or higher
    """
    assert (
        model.vector_size >= 2
    ), "This function expects a model of size 2 (2-dimension word vectors) or higher."

    try:
        if method == "PCA":
            from sklearn.decomposition import PCA
            dimred = PCA(2, *args, **kwargs)
        elif method == "TSNE":
            from sklearn.manifold import TSNE
            dimred = TSNE(2, *args, **kwargs)
        else:
            raise AssertionError(
                "Model must be one of PCA or TSNE for model with greater than 2 dimensions"
            )

        all_words = []
        all_vecs = []

        for word in words:
            all_words.append(word)
            all_vecs.append(model.wv[word])
            neighbors = model.wv.most_similar(word, topn=k)
            for neighbor, _ in neighbors:
                all_words.append(neighbor)
                all_vecs.append(model.wv[neighbor])

        all_vecs = np.array(all_vecs)
        if model.vector_size > 2:
            all_vecs = dimred.fit_transform(all_vecs)

        with plt.style.context("seaborn-pastel"):
            plt.figure(figsize=(10, 7), dpi=180)
            scatter = plt.scatter(
                all_vecs[:, 0], all_vecs[:, 1], s=5, alpha=0.3, edgecolors="k", c="c"
            )

            for word, (x, y) in zip(all_words, all_vecs):
                plt.text(x - 0.02, y + 0.02, word, fontsize=5, alpha=0.5)

            if draggable:
                plt.legend(words, loc="best", fontsize=8, markerscale=2, frameon=True)
                plt.gca().get_legend().set_draggable(True)

        plt.show()
    except ValueError as e:
        raise ValueError("Fail to perform dimensionality reduction.")
```