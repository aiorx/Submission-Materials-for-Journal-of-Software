```python
nframes = tf.shape(coord)[0]
coord = tf.reshape(coord, [nframes, -1, 3])
nloc = tf.shape(coord)[1]
coord = tf.reshape(coord, [nframes, nloc * 3])
extend_coord, extend_atype, _ = extend_coord_with_ghosts(
    coord, atype, cell, self.rcut, pbc
)

coord1 = tf.reshape(extend_coord, [nframes, -1])
nall = tf.shape(coord1)[1] // 3
coord0 = coord1[:, : nloc * 3]
diff = (
    tf.reshape(coord1, [nframes, -1, 3])[:, None, :, :]
    - tf.reshape(coord0, [nframes, -1, 3])[:, :, None, :]
)
# shape of diff: nframes, nloc, nall, 3
# remove the diagonal elements
mask = tf.eye(nloc, nall, dtype=tf.bool)
# expand mask
mask = tf.tile(mask[None, :, :], [nframes, 1, 1])
# expand inf
inf_mask = tf.constant(
    float("inf"), dtype=GLOBAL_TF_FLOAT_PRECISION, shape=[1, 1, 1]
)
inf_mask = tf.tile(inf_mask, [nframes, nloc, nall])
# virtual type (<0) are not counted
virtual_type_mask_i = tf.tile(tf.less(atype, 0)[:, :, None], [1, 1, nall])
virtual_type_mask_j = tf.tile(
    tf.less(extend_atype, 0)[:, None, :], [1, nloc, 1]
)
mask = mask | virtual_type_mask_i | virtual_type_mask_j
rr2 = tf.reduce_sum(tf.square(diff), axis=-1)
rr2 = tf.where(mask, inf_mask, rr2)
min_rr2 = tf.reduce_min(rr2, axis=(1, 2))
# count the number of neighbors
if self.distinguish_types:
    mask = rr2 < self.rcut**2
    nnei = []
    for ii in range(self.ntypes):
        nnei.append(
            tf.reduce_sum(
                tf.cast(
                    mask & (tf.equal(extend_atype, ii))[:, None, :], tf.int32
                ),
                axis=-1,
            )
        )
    # shape: nframes, nloc, ntypes
    nnei = tf.stack(nnei, axis=-1)
else:
    mask = rr2 < self.rcut**2
    # virtual types (<0) are not counted
    nnei = tf.reshape(
        tf.reduce_sum(
            tf.cast(
                mask & tf.greater_equal(extend_atype, 0)[:, None, :], tf.int32
            ),
            axis=-1,
        ),
        [nframes, nloc, 1],
    )
# nnei: nframes, nloc, ntypes
# virtual type i (<0) are not counted
nnei = tf.where(
    tf.tile(
        tf.less(atype, 0)[:, :, None],
        [1, 1, self.ntypes if self.distinguish_types else 1],
    ),
    tf.zeros_like(nnei, dtype=tf.int32),
    nnei,
)
max_nnei = tf.reduce_max(nnei, axis=1)
return min_rr2, max_nnei
```