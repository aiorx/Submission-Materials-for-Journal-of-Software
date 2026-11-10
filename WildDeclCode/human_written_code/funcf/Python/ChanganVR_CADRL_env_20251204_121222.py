```python
def compute_joint_state(self, agent_idx):
    if self.agents[agent_idx].done:
        return None
    else:
        return JointState(*(self.agents[agent_idx].get_full_state() +
                          self.agents[1-agent_idx].get_observable_state()))
```