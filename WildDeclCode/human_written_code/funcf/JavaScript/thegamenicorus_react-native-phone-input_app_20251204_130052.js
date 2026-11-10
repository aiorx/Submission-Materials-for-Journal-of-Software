```javascript
updateInfo() {
  this.setState({
    valid: this.phone.isValidNumber(),
    type: this.phone.getNumberType(),
    value: this.phone.getValue()
  });
}
```