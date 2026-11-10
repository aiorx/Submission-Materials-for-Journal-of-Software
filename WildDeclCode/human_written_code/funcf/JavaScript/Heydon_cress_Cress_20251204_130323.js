```js
this.getProps = elem => {
  if (!config.props) {
    return null;
  }
  let props = {};
  for (let prop in config.props) {
    let attr = elem.getAttribute(`data-cress-${prop}`);
    props[prop] = attr ? attr : config.props[prop];
  }
  return props;
}
```