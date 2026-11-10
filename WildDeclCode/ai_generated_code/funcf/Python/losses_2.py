```python
loss = -torch.nan_to_num(prob_cat.transpose(0, -1).unsqueeze(-1) * (
   ((real_origin.unsqueeze(0) + predictions['z_1']) != 0).float() * torch.lgamma(real_origin.unsqueeze(0) + predictions['z_1']) -
   torch.lgamma(real_origin + 1).unsqueeze(0) -
   (predictions['z_1'] != 0).float() * torch.lgamma(predictions['z_1']) +
   real_origin.unsqueeze(0) * torch.log(1 - predictions['z_2']) +
   predictions['z_1'] * torch.log(predictions['z_2'])
   ), nan=0.0, posinf=0.0, neginf=0.0).sum((0, -1))
```