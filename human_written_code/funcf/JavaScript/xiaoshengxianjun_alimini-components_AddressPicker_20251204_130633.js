```javascript
clickCancel() {
  let obj = {
    type: 'cancel',
    value: ''
  }
  this.props.onChange(obj);
}
```