/**
 * all of this file (except for this comment)
 * was Composed with basic coding tools
 * 
 * lol :p
*/

var imageElement = document.getElementById('topLogo');
var canvasElement = document.getElementById('canvas');
canvasElement.width = imageElement.width;
canvasElement.height = imageElement.height;
var context = canvasElement.getContext('2d');
context.drawImage(imageElement, 0, 0);
var imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
var data = imageData.data;
for (var i = 0; i < data.length; i += 4) {
  var r = data[i];
  var g = data[i + 1];
  var b = data[i + 2];
  r = (r + i) % 256;
  g = (g + i) % 256;
  b = (b + i) % 256;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
}
context.putImageData(imageData, 0, 0);
setInterval(function () {
    context.putImageData(imageData, 0, 0);
    }, 50);
