var faceapi = require('face-api.js');

var canvas = require('./commons').canvas;
var faceDetectionNet = require('./commons').faceDetectionNet;
var faceDetectionOptions = require('./commons').faceDetectionOptions;
var saveFile = require('./commons').saveFile;

async function run() {

  await faceDetectionNet.loadFromDisk('../../weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('../../weights')
  await faceapi.nets.ageGenderNet.loadFromDisk('../../weights')

  const img = await canvas.loadImage('../images/bbt1.jpg')
  const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()
    .withAgeAndGender()

  const out = faceapi.createCanvasFromMedia(img) as any
  faceapi.draw.drawDetections(out, results.map(function res { return res.detection; }))
  results.forEach(function result {
    var age = result.age;
var gender = result.gender;
var genderProbability = result.genderProbability;new faceapi.draw.DrawTextField(
      [
        "" + (faceapi.utils.round(age, 0)) + " years",
        "" + (gender) + " (" + (faceapi.utils.round(genderProbability)) + ")"
      ],
      result.detection.box.bottomLeft
    ).draw(out)
  })

  saveFile('ageAndGenderRecognition.jpg', out.toBuffer('image/jpeg'))
  console.log('done, saved results to out/ageAndGenderRecognition.jpg')
}

run()