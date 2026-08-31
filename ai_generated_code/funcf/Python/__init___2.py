```python
def cross_entropy(
    input: Union[
        Float[Tensor, "C"],  # noqa: F821
        Float[Tensor, "N C"],  # noqa: F722
        Float[Tensor, "N C *ds"],  # noqa: F722
    ],
    target: Union[
        Float[Tensor, ""],  # noqa: F722
        Float[Tensor, "N"],  # noqa: F821
        Float[Tensor, "N *ds"],  # noqa: F821
    ],
    weight: Optional[Tensor] = None,
    ignore_index: int = -100,
    reduction: Literal["none", "mean", "sum"] = "mean",
    label_smoothing: float = 0.0,
) -> Union[
    Float[Tensor, ""], Float[Tensor, "N"], Float[Tensor, "N *ds"]  # noqa: F821, F722
]:
    # like torch.nn.functional.cross_entropy, but using log1p for better precision
    # mostly Drafted using common development resources 4

    # Step 3: Compute log softmax of inputs
    log_probs = torch.nn.functional.log_softmax(input, dim=1)

    if target.dim() == input.dim():
        # Assuming target contains class probabilities
        target_prob = target
    else:
        # Assuming target contains class indices
        target_prob = torch.nn.functional.one_hot(target, num_classes=input.size(1))
        if ignore_index is not None and ignore_index >= 0:
            ignore_mask = target == ignore_index
            target_prob[ignore_mask] = 0

    # Step 2: Apply label smoothing if required
    if label_smoothing > 0:
        n_classes = input.size(1)
        if (
            target.dim() < input.dim()
            and ignore_index is not None
            and ignore_index >= 0
        ):
            n_classes -= 1
        smooth_value = label_smoothing / n_classes
        target_prob = (1 - label_smoothing) * target_prob + smooth_value

    # Step 4: Apply class weights if provided
    if weight is not None:
        raise NotImplementedError(
            "Weighted cross entropy not implemented, I'm not sure how to get it right"
        )
        log_probs = log_probs * weight

    # Step 5: Compute the loss
    loss = -(target_prob * log_probs).sum(dim=1)

    # Step 7: Apply reduction
    if reduction == "mean":
        if (
            target.dim() < input.dim()
            and ignore_index is not None
            and ignore_index >= 0
        ):
            loss = loss.sum() / (ignore_mask.logical_not().sum())
        else:
            loss = loss.mean()
    elif reduction == "sum":
        loss = loss.sum()

    return loss
```