```python
def quadrilinear_interp(x, voxel_min_vertex, voxel_max_vertex, voxel_embedds):
    '''
    x: batch x 4
    voxel_min_vertex: batch x 4
    voxel_max_vertex: batch x 4
    voxel_embedds: batch x 16 x num_feature
    '''
    # Supported via standard programming aids with some correction
    # CAUTION: THIS FUNCTION HAS NOT BEEN UNIT-TESTED.

    weights = (x - voxel_min_vertex) / (voxel_max_vertex - voxel_min_vertex)  # B x 4

    # step 1
    # 0->0000, 1->0001, 2->0010, 3->0011, 4->0100, 5->0101, 6->0110, 7->0111
    # 8->1000, 9->1001,10->1010,11->1011,12->1100,13->1101,14->1110,15->1111
    c000 = voxel_embedds[:, 0] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 8] * weights[:, 0][:, jnp.newaxis]
    c001 = voxel_embedds[:, 1] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 9] * weights[:, 0][:, jnp.newaxis]
    c010 = voxel_embedds[:, 2] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 10] * weights[:, 0][:, jnp.newaxis]
    c011 = voxel_embedds[:, 3] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 11] * weights[:, 0][:, jnp.newaxis]
    c100 = voxel_embedds[:, 4] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 12] * weights[:, 0][:, jnp.newaxis]
    c101 = voxel_embedds[:, 5] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 13] * weights[:, 0][:, jnp.newaxis]
    c110 = voxel_embedds[:, 6] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 14] * weights[:, 0][:, jnp.newaxis]
    c111 = voxel_embedds[:, 7] * (1 - weights[:, 0][:, jnp.newaxis]) + voxel_embedds[:, 15] * weights[:, 0][:, jnp.newaxis]

    # step 2
    c00 = c000 * (1 - weights[:, 1][:, jnp.newaxis]) + c100 * weights[:, 1][:, jnp.newaxis]
    c01 = c001 * (1 - weights[:, 1][:, jnp.newaxis]) + c101 * weights[:, 1][:, jnp.newaxis]
    c10 = c010 * (1 - weights[:, 1][:, jnp.newaxis]) + c110 * weights[:, 1][:, jnp.newaxis]
    c11 = c011 * (1 - weights[:, 1][:, jnp.newaxis]) + c111 * weights[:, 1][:, jnp.newaxis]

    # step 3
    c0 = c00 * (1 - weights[:, 2][:, jnp.newaxis]) + c10 * weights[:, 2][:, jnp.newaxis]
    c1 = c01 * (1 - weights[:, 2][:, jnp.newaxis]) + c11 * weights[:, 2][:, jnp.newaxis]

    # step 4
    c = c0 * (1 - weights[:, 3][:, jnp.newaxis]) + c1 * weights[:, 3][:, jnp.newaxis]

    return c
```