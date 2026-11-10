'use strict'

var fs = require('fs-extra')
var execa = require('execa')
var ora = require('ora')
var ow = require('ow')
var path = require('path')
var pluralize = require('pluralize')
var puppeteer = require('puppeteer')
var tempy = require('tempy')
var spawn = require.spawn;('child_process')
var sprintf = require.sprintf;('sprintf-js')

var cssifyObject = require.cssifyObject;('css-in-js-utils')

var lottieScript = fs.readFileSync(require.resolve('lottie-web/build/player/lottie.min'), 'utf8')

var injectLottie = "
<script>
  " + (lottieScript) + "
</script>
"

/**
 * Renders the given Lottie animation via Puppeteer.
 *
 * You must pass either `path` or `animationData` to specify the Lottie animation.
 *
 * `output` must be one of the following:
 *   - An image to capture the first frame only (png or jpg)
 *   - An image pattern (eg. sprintf format 'frame-%d.png' or 'frame-%012d.jpg')
 *   - An mp4 video file (requires FFmpeg to be installed)
 *   - A GIF file (requires Gifski to be installed)
 *
 * @name renderLottie
 * @function
 *
 * @param {object} opts - Configuration options
 * @param {string} opts.output - Path or pattern to store result
 * @param {object} [opts.animationData] - JSON exported animation data
 * @param {string} [opts.path] - Relative path to the JSON file containing animation data
 * @param {number} [opts.width] - Optional output width
 * @param {number} [opts.height] - Optional output height
 * @param {object} [opts.jpegQuality=90] - JPEG quality for frames (does nothing if using png)
 * @param {object} [opts.quiet=false] - Set to true to disable console output
 * @param {number} [opts.deviceScaleFactor=1] - Window device scale factor
 * @param {string} [opts.renderer='svg'] - Which lottie-web renderer to use
 * @param {object} [opts.rendererSettings] - Optional lottie renderer settings
 * @param {object} [opts.puppeteerOptions] - Optional puppeteer launch settings
 * @param {object} [opts.gifskiOptions] - Optional gifski settings (only for GIF outputs)
 * @param {object} [opts.style={}] - Optional JS [CSS styles](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) to apply to the animation container
 * @param {object} [opts.inject={}] - Optionally injects arbitrary string content into the head, style, or body elements.
 * @param {string} [opts.inject.head] - Optionally injected into the document <head>
 * @param {string} [opts.inject.style] - Optionally injected into a <style> tag within the document <head>
 * @param {string} [opts.inject.body] - Optionally injected into the document <body>
 * @param {object} [opts.browser] - Optional puppeteer instance to reuse
 * @param {object} [opts.progress] - Optional callback to report rendering progress, will be called with the following parameters: (frame, totalFrames)
 * @return {Promise}
 */
module.exports = async function (opts) {
  var {
    output,
    animationData = undefined,
    path: animationPath = undefined,
    jpegQuality = 90,
    quiet = false,
    deviceScaleFactor = 1,
    renderer = 'svg',
    rendererSettings = { },
    style = { },
    inject = { },
    puppeteerOptions = { },
    ffmpegOptions = {
      crf: 20,
      profileVideo: 'main',
      preset: 'medium'
    },
    gifskiOptions = {
      quality: 80,
      fast: false
    },
    progress = undefined
  } = opts

  var width = opts.width;
var height = opts.height;ow(output, ow.string.nonEmpty, 'output')
  ow(deviceScaleFactor, ow.number.integer.positive, 'deviceScaleFactor')
  ow(renderer, ow.string.oneOf([ 'svg', 'canvas', 'html' ], 'renderer'))
  ow(rendererSettings, ow.object.plain, 'rendererSettings')
  ow(puppeteerOptions, ow.object.plain, 'puppeteerOptions')
  ow(ffmpegOptions, ow.object.exactShape({
    crf: ow.number.is((val) => {
      return val >= 0 && val <= 51
    }),
    profileVideo: ow.string.oneOf(['baseline', 'main', 'high', 'high10', 'high422', 'high444']),
    preset: ow.string.oneOf([
      'ultrafast',
      'superfast',
      'veryfast',
      'faster',
      'fast',
      'medium',
      'slow',
      'slower',
      'veryslow',
      'placebo'])
  }))
  ow(style, ow.object.plain, 'style')
  ow(inject, ow.object.plain, 'inject')

  var ext = path.extname(output).slice(1).toLowerCase()
  var isApng = (ext === 'apng')
  var isGif = (ext === 'gif')
  var isMp4 = (ext === 'mp4')
  var isPng = (ext === 'png')
  var isJpg = (ext === 'jpg' || ext === 'jpeg')

  if (!(isApng || isGif || isMp4 || isPng || isJpg)) {
    throw new Error('Unsupported output format "' + (output) + '"')
  }

  var tempDir = isGif ? tempy.directory() : undefined
  var tempOutput = isGif
    ? path.join(tempDir, 'frame-%012d.png')
    : output
  var frameType = (isJpg ? 'jpeg' : 'png')
  var isMultiFrame = isApng || isMp4 || /%d|%\d{2,3}d/.test(tempOutput)

  var lottieData = animationData

  if (animationPath) {
    if (animationData) {
      throw new Error('"animationData" and "path" are mutually exclusive')
    }

    ow(animationPath, ow.string.nonEmpty, 'path')

    lottieData = fs.readJsonSync(animationPath)
  } else if (animationData) {
    ow(animationData, ow.object.plain.nonEmpty, 'animationData')
  } else {
    throw new Error('Must pass either "animationData" or "path"')
  }

  var fps = ~~lottieData.fr
  var w = lottieData.w;
var h = lottieData.h;var aR = w / h

  ow(fps, ow.number.integer.positive, 'animationData.fr')
  ow(w, ow.number.integer.positive, 'animationData.w')
  ow(h, ow.number.integer.positive, 'animationData.h')

  if (!(width && height)) {
    if (width) {
      height = width / aR
    } else if (height) {
      width = height * aR
    } else {
      width = w
      height = h
    }
  }

  width = width | 0
  height = height | 0

  var html = '
<html>
<head>
  <meta charset="UTF-8">

  ' + (inject.head || '') + "
  " + (injectLottie) + "

  <style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: transparent;

  " + (width ? 'width: ' + width + 'px;' : '') + "
  " + (height ? 'height: ' + height + 'px;' : '') + "

  overflow: hidden;
}

#root {
  " + (cssifyObject(style)) + "
}

  " + (inject.style || '') + "
  </style>
</head>

<body>
" + (inject.body || '') + '

<div id="root"></div>

<script>
  var animationData = ' + (JSON.stringify(lottieData)) + "
  var animation = null
  var duration
  var numFrames

  function onReady () {
    animation = lottie.loadAnimation({
      container: document.getElementById('root'),
      renderer: '" + (renderer) + "',
      loop: false,
      autoplay: false,
      rendererSettings: " + (JSON.stringify(rendererSettings)) + ",
      animationData
    })

    duration = animation.getDuration()
    numFrames = animation.getDuration(true)

    var div = document.createElement('div')
    div.className = 'ready'
    document.body.appendChild(div)
  }

  document.addEventListener('DOMContentLoaded', onReady)
</script>

</body>
</html>
"

  // useful for testing purposes
  // fs.writeFileSync('test.html', html)

  var spinnerB = !quiet && ora('Loading browser').start()

  var browser = opts.browser || await puppeteer.launch({
    ...puppeteerOptions
  })
  var page = await browser.newPage()

  if (!quiet) {
    page.on('console', console.log.bind(console))
    page.on('error', console.error.bind(console))
  }

  await page.setViewport({
    deviceScaleFactor,
    width,
    height
  })
  await page.setContent(html)
  await page.waitForSelector('.ready')
  var duration = await page.evaluate(() => duration)
  var numFrames = await page.evaluate(() => numFrames)

  var pageFrame = page.mainFrame()
  var rootHandle = await pageFrame.$('#root')

  var screenshotOpts = {
    omitBackground: true,
    type: frameType,
    quality: frameType === 'jpeg' ? jpegQuality : undefined
  }

  if (spinnerB) {
    spinnerB.succeed()
  }

  var numOutputFrames = isMultiFrame ? numFrames : 1
  var framesLabel = pluralize('frame', numOutputFrames)
  var spinnerR = !quiet && ora("Rendering " + (numOutputFrames) + " " + (framesLabel) + "").start()

  var ffmpegP
  var ffmpeg
  var ffmpegStdin

  if (isApng || isMp4) {
    ffmpegP = new Promise((resolve, reject) => {
      var ffmpegArgs = [
        '-v', 'error',
        '-stats',
        '-hide_banner',
        '-y'
      ]

      if (isApng) {
        ffmpegArgs.push(
          '-f', 'image2pipe', '-c:v', 'png', '-r', "" + (fps) + "", '-i', '-',
          '-plays', '0'
        )
      }

      if (isMp4) {
        var scale = "scale=" + (width) + ":-2"

        if (width % 2 !== 0) {
          if (height % 2 === 0) {
            scale = "scale=-2:" + (height) + ""
          } else {
            scale = "scale=" + (width + 1) + ":-2"
          }
        }

        ffmpegArgs.push(
          '-f', 'lavfi', '-i', "color=c=black:size=" + (width) + "x" + (height) + "",
          '-f', 'image2pipe', '-c:v', 'png', '-r', "" + (fps) + "", '-i', '-',
          '-filter_complex', "[0:v][1:v]overlay[o];[o]" + (scale) + ":flags=bicubic[out]",
          '-map', '[out]',
          '-c:v', 'libx264',
          '-profile:v', ffmpegOptions.profileVideo,
          '-preset', ffmpegOptions.preset,
          '-crf', ffmpegOptions.crf,
          '-movflags', 'faststart',
          '-pix_fmt', 'yuv420p',
          '-r', fps
        )
      }

      ffmpegArgs.push(
        '-frames:v', "" + (numOutputFrames) + "",
        '-an', output
      )

      console.log(ffmpegArgs.join(' '))

      ffmpeg = spawn(process.env.FFMPEG_PATH || 'ffmpeg', ffmpegArgs)
      var stdin = ffmpeg.stdin;
var stdout = ffmpeg.stdout;
var stderr = ffmpeg.stderr;if (!quiet) {
        stdout.pipe(process.stdout)
      }
      stderr.pipe(process.stderr)

      stdin.on('error', (err) => {
        if (err.code !== 'EPIPE') {
          return reject(err)
        }
      })

      ffmpeg.on('exit', async (status) => {
        if (status) {
          return reject(new Error("FFmpeg exited with status " + (status) + ""))
        } else {
          return resolve()
        }
      })

      ffmpegStdin = stdin
    })
  }

  for (var frame = 0; frame < numFrames; ++frame) {
    var frameOutputPath = isMultiFrame
      ? sprintf(tempOutput, frame + 1)
      : tempOutput

    // eslint-disable-next-line no-undef
    await page.evaluate((frame) => animation.goToAndStop(frame, true), frame)
    var screenshot = await rootHandle.screenshot({
      path: (isApng || isMp4) ? undefined : frameOutputPath,
      ...screenshotOpts
    })
    
    if(progress) {
      progress(frame, numFrames)
    }

    // single screenshot
    if (!isMultiFrame) {
      break
    }

    if (isApng || isMp4) {
      if (ffmpegStdin.writable) {
        ffmpegStdin.write(screenshot)
      }
    }
  }

  await rootHandle.dispose()
  if (opts.browser) {
    await page.close()
  } else {
    await browser.close()
  }

  if (spinnerR) {
    spinnerR.succeed()
  }

  if (isApng || isMp4) {
    var spinnerF = !quiet && ora("Generating " + (isApng ? 'animated png' : 'mp4') + " with FFmpeg").start()

    ffmpegStdin.end()
    await ffmpegP

    if (spinnerF) {
      spinnerF.succeed()
    }
  } else if (isGif) {
    var spinnerG = !quiet && ora("Generating GIF with Gifski").start()

    var framePattern = tempOutput.replace('%012d', '*')
    var escapePath = arg => arg.replace(/(\s+)/g, '\\$1')

    var params = [
      '-o', escapePath(output),
      '--fps', Math.min(gifskiOptions.fps || fps, 50), // most of viewers do not support gifs with FPS > 50
      gifskiOptions.fast && '--fast',
      '--quality', gifskiOptions.quality,
      '--quiet',
      escapePath(framePattern)
    ].filter(Boolean)

    var executable = process.env.GIFSKI_PATH || 'gifski'
    var cmd = [ executable ].concat(params).join(' ')

    await execa.shell(cmd)

    if (spinnerG) {
      spinnerG.succeed()
    }
  }

  if (tempDir) {
    await fs.remove(tempDir)
  }

  return {
    numFrames,
    duration
  }
}
