```python
def get_lr(global_step, batch_size):
    """Get learning rate given global step."""
    if lr_type == 'fixed':
        lr = learning_rate_init
    elif lr_type == 'exponential':
        lr = learning_rate_init * lr_decay_factor ** (global_step / (batch_size * lr_decay_epoch))
        if lr < lr_lower_bound:
            lr = lr_lower_bound
    elif lr_type == 'cosine_decay':
        total_steps = total_epoches * batch_size
        lr = lr_lower_bound + 0.5 * (learning_rate_init - lr_lower_bound) * (
            1 + math.cos(global_step * 3.1415926 / total_steps))
    elif lr_type == 'cosine_decay_restart':
        step_in_cycle = global_step % (lr_decay_epoch * batch_size)
        lr = lr_lower_bound + 0.5 * (learning_rate_init - lr_lower_bound) * (
            1 + math.cos(step_in_cycle * 3.1415926 / (lr_decay_epoch * batch_size)))
    elif lr_type == 'piecewise':
        boundaries = [b * batch_size for b in pw_boundaries]
        values = pw_values
        for i in range(len(boundaries)):
            if global_step < boundaries[i]:
                lr = values[i]
                break
        else:
            lr = values[-1]
    else:
        raise ValueError('Unknown lr_type: %s' % lr_type)
    return lr
```