```typescript
public callApi = () => {
  this.apiService
    .callApi()
    .then(data => {
      this.setState({ api: data.data });
      toast.success('Api return successfully data, check in section - Api response');
    })
    .catch(error => {
      toast.error(error);
    });
};
```