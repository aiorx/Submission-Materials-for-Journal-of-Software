```javascript
function generatePropType(type) {
  let values;
  let name;
  name = type.name;
  if(type.name==='signature'){
    name = type.raw;
  }
  if (Array.isArray(type.value)) {
    values =
      '(' +
      type.value
        .map(function(typeValue) {
          return typeValue.name || typeValue.value;
        })
        .join('|') +
      ')';
  } else {
    values = type.value;
  }

  return 'type: `' + name + (values ? values : '') + '`\n';
}
```