```python
@staticmethod
def reduce_metrics(logging_outputs) -> None:
    """Aggregate logging outputs from data parallel training (copied from normal cross entropy)."""
    loss_sum = sum(log.get("loss", 0) for log in logging_outputs)
    ntokens = sum(log.get("ntokens", 0) for log in logging_outputs)
    sample_size = sum(log.get("sample_size", 0) for log in logging_outputs)

    metrics.log_scalar(
        "loss", loss_sum / sample_size / math.log(2), sample_size, round=3
    )
    if sample_size != ntokens:
        metrics.log_scalar(
            "nll_loss", loss_sum / ntokens / math.log(2), ntokens, round=3
        )
        metrics.log_derived(
            "ppl", lambda meters: utils.get_perplexity(meters["nll_loss"].avg)
        )
    else:
        metrics.log_derived(
            "ppl", lambda meters: utils.get_perplexity(meters["loss"].avg)
        )

    counts = {}
    for lk in logging_outputs[0].keys():
        if lk.startswith("loss") or lk.startswith("nll_loss"):
            continue
        counts[lk] = sum(log.get(lk, 0) for log in logging_outputs)
    for k, v in counts.items():
        metrics.log_scalar(k, v, sample_size, round=3)
```