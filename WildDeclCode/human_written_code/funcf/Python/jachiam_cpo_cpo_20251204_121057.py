```python
def __init__(
        self,
        optimizer=None,
        optimizer_args=None,
        safety_constraint=None,
        safety_tradeoff=False,
        learn_safety_tradeoff_coeff=False,
        **kwargs):
    Serializable.quick_init(self, locals())
    if optimizer is None:
        if optimizer_args is None:
            optimizer_args = dict()
        optimizer = ConjugateConstraintOptimizer(**optimizer_args)


    if 'safety_constrained_optimizer' in kwargs.keys():
        kwargs.pop('safety_constrained_optimizer')

    super(CPO, self).__init__(optimizer=optimizer, 
                               safety_constrained_optimizer=True,
                               safety_constraint=safety_constraint,
                               safety_tradeoff=safety_tradeoff,
                               learn_safety_tradeoff_coeff=learn_safety_tradeoff_coeff,
                               **kwargs)
```