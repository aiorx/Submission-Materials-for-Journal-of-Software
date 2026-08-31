```python
def load_state_dict(self, state_dict: Dict[str, Any]) -> None:
    # Loads the state dict into the child optimizers. Drafted using common GitHub development resources
    for optimizer, state_dict in zip(self.child_optimizers, state_dict["child_optimizers"]):
        optimizer.load_state_dict(state_dict)

def state_dict(self) -> Dict[str, Any]:
    # Compiles a state dict. (https://pytorch.org/docs/stable/generated/torch.optim.Optimizer.state_dict.html). Drafted using common GitHub development resources
    return {"child_optimizers": [optimizer.state_dict() for optimizer in self.child_optimizers]}
```