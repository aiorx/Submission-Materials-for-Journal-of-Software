"""
    Pytorch neural network class for Gomoku.

    Initial architecture was Supported via standard programming aids.
    Then it was changed taking into account the architecture from https://nikcheerla.github.io/deeplearningschool/2018/01/01/AlphaZero-Explained/.

    ## Policy head:
    - Purpose: Predicts which moves are promising in the current position.
    - Output: Log probabilities for each possible move (board_size * board_size).

    ## Value head:
    - Purpose: Estimates how good the current position is.
    - Output: A single value between -1 and 1 (win probability).

    ## Architecture:
    - Convolutions help to find patterns.
    - Max Pooling reduces the size of the feature map. I don't use it on smaller boards, because the network becomes too small.
    - Dropout removes some neurons to prevent overfitting.
    """