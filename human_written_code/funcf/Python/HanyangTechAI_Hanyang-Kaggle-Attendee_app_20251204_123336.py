```python
def metric(self, inferred_tensor: torch.Tensor, ground_truth: torch.Tensor) -> torch.Tensor:
    """Classification Accuracy
    example)
    inferred_tensor: [[0,0,1], [0,1,0]]
    ground_truth: [2, 0]
    return: 0.5
    :param inferred_tensor: (torch.Tensor) [batch_size, n_classes(3)], inferred logits
    :param ground_truth:  (torch.LongTensor) [batch_size], ground truth labels
                            each consisting LongTensor ranging from 0 to 2
    :return: (torch.Tensor) metric 점수
    """

    inferred_tensor = torch.argmax(inferred_tensor, dim=-1)
    acc = torch.mean((inferred_tensor == ground_truth).to(torch.float), dim=-1)
    return acc
```