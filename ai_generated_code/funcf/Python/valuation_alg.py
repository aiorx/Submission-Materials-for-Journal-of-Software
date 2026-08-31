```python
def data_value(self):
    #TODO Penned via standard GitHub programming aids, fix manually later
    self.select_data()
    total_score = 0
    chosen_points = self.data_points[self.selected_idx]
    chosen_reduced_points = self.reduced_images[self.selected_idx]
    chosen_labels = self.labels[self.selected_idx]
    #Uncertainty score, Diversity score and Loss score
    # Compute loss score
    self.model.eval()
    with torch.no_grad():
        outputs = self.model(chosen_points)
        loss = self.loss_fn(outputs, chosen_labels)
        loss_score = loss.item()

    # Compute uncertainty score
    outputs = nn.Softmax(dim=1)(outputs)
    uncertainty_score = -torch.sum(outputs * torch.log(outputs + 1e-9), dim=1).mean().item()

    # Compute diversity score
    diversity_score = 0
    for i in range(len(chosen_reduced_points)):
        point = chosen_reduced_points[i]
        if not isinstance(point, torch.Tensor):
            point = torch.tensor(point)
        #Compute the min. distance of point to any of Alice's cluster
        min_distance = torch.min(torch.linalg.norm(point - self.trained_clusters, dim=1)).item()
        diversity_score += min_distance
        #Compute the min. distance of point to any of the other selected points
        dist_self = torch.linalg.norm(point - chosen_reduced_points, dim=1)
        dist_self[i] = float('inf')
        min_dist_self = torch.min(dist_self).item()
        diversity_score += min_dist_self
    diversity_score /= len(chosen_reduced_points)
    diversity_score /= self.avg_l2norm #Normalization
    diversity_score /= 2

    total_score = self.a1 * loss_score + self.a2 * uncertainty_score + self.a3 *  diversity_score
    self.value = total_score
    return self.value
```