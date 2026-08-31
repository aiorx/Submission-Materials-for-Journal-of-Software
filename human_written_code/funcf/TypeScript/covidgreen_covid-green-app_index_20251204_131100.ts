```javascript
export const AppIcons = {
  Alert,
  ArrowRight,
  Back: Platform.OS === 'ios' ? BackIOS : BackAndroid,
  Bluetooth,
  Close,
  Notification,
  Share: Platform.OS === 'ios' ? ShareIOS : ShareAndroid,
  Success
};
```