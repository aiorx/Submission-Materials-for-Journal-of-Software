```python
def ppo_lagrangian(**kwargs):
    # Objective-penalized form of Lagrangian PPO.
    ppo_kwargs = dict(
                    reward_penalized=False,
                    objective_penalized=True,
                    learn_penalty=True,
                    penalty_param_loss=True
                    )
    agent = PPOAgent(**ppo_kwargs)
    run_polopt_agent(agent=agent, **kwargs)
```