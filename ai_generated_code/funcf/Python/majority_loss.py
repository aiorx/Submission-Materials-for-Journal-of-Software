```python
def forward(self, outputs, rank_counts, k=2):
    """
    Good function names are hard :/ Largely Produced using common development resources.
    Find the highest k indices in the outputs and the targets.
    Count how many people ranked that candidate first for both the output and the target.
    Return absolute difference of the two scores.
    Should be minimized when the candidates with most first place rankings are elected.

    Just something that gives a non-binary value that might actually teach a network.
    :param outputs:
    :param rank_counts:
    :return:
    """

    distances_across_batch = []
    for idx in range(len(outputs)):
        # generate list of all possible valid (majority-satisfying) committees for current index value of batch
        rc = rank_counts[idx]
        valid_committees = self.all_majority_committees(rc, k=k)
        if valid_committees is None:
            all_distances = torch.abs(outputs[idx] - outputs[idx])
            min_distance = torch.min(all_distances)
        else:
            all_distances = torch.abs(outputs[idx] - valid_committees)
            all_distances = torch.sum(all_distances, dim=1)
            min_distance = torch.min(all_distances)

        distances_across_batch.append(min_distance)

    distances_across_batch = torch.stack(distances_across_batch)
    loss = torch.mean(distances_across_batch)
    return loss
```