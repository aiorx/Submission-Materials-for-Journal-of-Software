```python
def eval(self, input, real_val):
    self.model.eval()
    input = nn.functional.pad(input,(1,0,0,0))
    output = self.model(input)
    output = output.transpose(1,3)
    #output = [batch_size,12,num_nodes,1]
    real = torch.unsqueeze(real_val,dim=1)
    predict = self.scaler.inverse_transform(output)
    loss = self.loss(predict, real, 0.0)
    mape = util.masked_mape(predict,real,0.0).item()
    rmse = util.masked_rmse(predict,real,0.0).item()
    return loss.item(),mape,rmse
```