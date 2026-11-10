```python
def step(self, epoch=None, closure=None):
    """Performs a single optimization step.

    Arguments:
        closure (callable, optional): A closure that reevaluates the model
            and returns the loss.
        epoch: current epoch to calculate polynomial LR decay schedule.
               if None, uses self.epoch and increments it.
    """
    loss = None
    if closure is not None:
        loss = closure()

    if epoch is None:
        epoch = self.epoch
        self.epoch += 1

    for group in self.param_groups:
        weight_decay = group['weight_decay']
        momentum = group['momentum']
        eta = group['eta']
        lr = group['lr']
        max_epoch = group['max_epoch']

        for p in group['params']:
            if p.grad is None:
                continue

            param_state = self.state[p]
            d_p = p.grad.data

            weight_norm = torch.norm(p.data)
            grad_norm = torch.norm(d_p)

            # Global LR computed on polynomial decay schedule
            decay = (1 - float(epoch) / max_epoch) ** 2
            global_lr = lr * decay

            # Compute local learning rate for this layer
            local_lr = eta * weight_norm / \
                (grad_norm + weight_decay * weight_norm)

            # Update the momentum term
            actual_lr = local_lr * global_lr

            if 'momentum_buffer' not in param_state:
                buf = param_state['momentum_buffer'] = \
                        torch.zeros_like(p.data)
            else:
                buf = param_state['momentum_buffer']
            buf.mul_(momentum).add_(actual_lr, d_p + weight_decay * p.data)
            p.data.add_(-buf)

    return loss
```