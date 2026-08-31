```js
/**
 * EBS Wrapper
 * @EBS
 * @param {object} options - { apiVersion }
 */

ebs(options) {
  this._apiVersion = options.apiVersion;
  return new ebs(this.getSDK(), this._apiVersion);
}
```