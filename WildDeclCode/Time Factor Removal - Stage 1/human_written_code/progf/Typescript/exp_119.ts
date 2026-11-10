// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
require('@tensorflow/tfjs-node');

var faceapi = require('face-api.js');

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
var canvas = require('canvas')

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
var Canvas = canvas.Canvas;
var Image = canvas.Image;
var ImageData = canvas.ImageData;faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

module.exports.canvas = canvas;
