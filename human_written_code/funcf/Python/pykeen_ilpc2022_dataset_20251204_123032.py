```python
def __init__(self, size: Size = "small", **kwargs):
    """Initialize the inductive link prediction dataset.

    :param size: "small" or "large"
    :param kwargs: keyword arguments to forward to the base dataset class, cf. DisjointInductivePathDataset
    """
    super().__init__(
        transductive_training_path=DATA.joinpath(size, "train.txt"),
        inductive_inference_path=DATA.joinpath(size, "inference.txt"),
        inductive_validation_path=DATA.joinpath(size, "inference_validation.txt"),
        inductive_testing_path=DATA.joinpath(size, "inference_test.txt"),
        create_inverse_triples=True,
        eager=True,
        **kwargs
    )
```