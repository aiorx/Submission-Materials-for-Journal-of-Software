```js
const decrypt = (encryptedTxt) => {
  const decipher = crypto.createDecipher('aes-256-ctr', salt);
  let decrypted = decipher.update(encryptedTxt, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```