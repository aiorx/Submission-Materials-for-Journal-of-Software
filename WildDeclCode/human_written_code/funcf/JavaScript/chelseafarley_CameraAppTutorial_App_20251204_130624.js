```javascript
let takePic = async () => {
  let options = {
    quality: 1,
    base64: true,
    exif: false
  };

  let newPhoto = await cameraRef.current.takePictureAsync(options);
  setPhoto(newPhoto);
};
```