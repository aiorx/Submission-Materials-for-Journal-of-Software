'use strict'

var ffmpegProbe = require('ffmpeg-probe')
var fs = require('fs-extra')
var path = require('path')
var test = require('ava')
var imageSize = require('image-size')
var tempy = require('tempy')
var sprintf = require.sprintf;('sprintf-js')

var renderLottie = require('.')

var bodymovin = 'fixtures/bodymovin.json'

test('bodymovin.json => single frame png', async function (t) {
  var output = tempy.file({ extension: 'png' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    output
  })

  var image = imageSize(output)
  t.is(image.width, 1820)
  t.is(image.height, 275)

  await fs.remove(output)
})

test('bodymovin.json => single frame jpg scale=640:-1', async function (t) {
  var output = tempy.file({ extension: 'jpg' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    width: 640,
    output
  })

  var image = imageSize(output)
  t.is(image.width, 640)
  t.is(image.height, 96)

  await fs.remove(output)
})

test('bodymovin.json => png frames scale=-1:100', async function (t) {
  var temp = tempy.directory()
  var output = path.join(temp, 'frame-%d.png')

  await renderLottie({
    path: bodymovin,
    quiet: true,
    height: 100,
    output
  })

  for (var i = 1; i < 103; ++i) {
    var image = imageSize(sprintf(output, i))
    t.is(image.width, 661)
    t.is(image.height, 100)
  }

  await fs.remove(output)
})

if (!process.env.CI) {
  test('bodymovin.json => GIF', async function (t) {
    var output = tempy.file({ extension: 'gif' })

    await renderLottie({
      path: bodymovin,
      quiet: true,
      output
    })

    console.log(output)
    var image = imageSize(output)
    console.log(image)
    t.is(image.width, 1820)
    t.is(image.height, 275)

    await fs.remove(output)
  })
}

test('bodymovin.json => mp4', async function (t) {
  var output = tempy.file({ extension: 'mp4' })

  await renderLottie({
    path: bodymovin,
    quiet: true,
    ffmpegOptions: {
      crf: 22,
      profileVideo: 'high',
      preset: 'fast'
    },
    output
  })

  var probe = await ffmpegProbe(output)
  // height is scaled up a bit because h264 encoder requires an even height
  t.is(probe.width, 1820)
  t.is(probe.height, 274)
  t.is(probe.streams[0].profile, 'High')

  await fs.remove(output)
})
