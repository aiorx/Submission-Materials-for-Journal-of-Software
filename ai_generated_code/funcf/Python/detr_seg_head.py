```python
        #########################################################################
        # the following code is Written with routine coding tools3.5 and debugged, output is same
        # with the handwritting loop code below.
        # FIXME: the whole process needs dicussion. about interpolation.
        # Extract indices for each dimension
        indices_0 = torch.arange(attention_weights.shape[0]).view(-1, 1).cuda()
        indices_1 = sampling_locations[:, :, 0].long()
        indices_0 = indices_0.expand_as(indices_1)
        attention_indices = torch.stack(
            [indices_0, indices_1, sampling_locations[:, :, 1].long()], dim=-1
        )

        # Use advanced indexing to update attention_maps
        for point in range(num_points):
            attention_maps[
                attention_indices[:, point, 0],
                attention_indices[:, point, 1],
                attention_indices[:, point, 2],
            ] += attention_weights[:, point]
```