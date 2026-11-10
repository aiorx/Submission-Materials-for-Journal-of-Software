const encryptWithXOR = function (value: string, key = 5) { return value
  .split('')
  .map(c => (c.charCodeAt(0) ^ key).toString(16))
  .join(''); };
