```python
def _solve_conflict(self, staleness, server_param, client_param, client_grad, model, client_id):
    self.logger.info(f'client {client_id} staleness: {staleness}')
    cur_idx = 0
    new_param = torch.zeros_like(server_param)
    for parameter in model.parameters():
        numel = parameter.data.numel()
        # size = parameter.data.size()

        _server_param = server_param[cur_idx:cur_idx + numel]
        _client_param = client_param[cur_idx:cur_idx + numel]
        _client_grad = client_grad[cur_idx:cur_idx + numel]

        _update_from_param = torch.sub(_client_param, _client_grad)
        _gc = torch.sub(_client_param, _update_from_param)
        _gs = torch.sub(_server_param, _update_from_param)
        _gsr = torch.mul((torch.log(staleness) + 1), _gs)

        # print(f"_gc size: {_gc.size()}, _gs size: {_gs.size()}, _gsr size: {_gsr.size()}")
        _sim = torch.cosine_similarity(_gc, _gsr, dim=0)
        _sim = torch.clamp(_sim, min=-1, max=1)

        _comp = self._cur_round / self._total_client - self._update_times[client_id]
        _comp = torch.tensor(_comp, dtype=torch.float32)
        _comp_weight = torch.tensor(0.0, dtype=torch.float32)
        if _comp > 0:
            _comp_weight = _comp / torch.exp(_comp)

        if _sim < 0:
            _alpha = torch.tensor(self.alpha, dtype=torch.float32)
            _alpha = _alpha * torch.abs(_sim) * (1 - _comp_weight)
            self.logger.info(f'sim {_sim} alpha: {_alpha} comp_weight: {_comp_weight}')
            _new_param = torch.add(_client_param * _alpha, _server_param * (1 - _alpha))
        else:
            _alpha = torch.tensor(self.alpha, dtype=torch.float32)
            _alpha = _alpha * _sim * (1 + _comp_weight)
            self.logger.info(f'sim {_sim} alpha: {_alpha} comp_weight: {_comp_weight}')
            _new_param = torch.add(_client_param * _alpha, _server_param * (1 - _alpha))

        new_param[cur_idx:cur_idx + numel] = _new_param
        cur_idx += numel

    return new_param
```