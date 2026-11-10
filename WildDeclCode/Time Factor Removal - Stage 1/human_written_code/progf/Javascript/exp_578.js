'use strict'

var Qs = require('qs')
var once = require('once')
var request = require('./request')
var streamToValue = require('./stream-to-value')
var streamToJsonValue = require('./stream-to-json-value')

function parseError (res, callback) {
  var error = new Error("Server responded with " + (res.statusCode) + "")

  // streamToJsonValue(res, (err, payload) => {
  streamToValue(res, function (err, payload) {
    if (err) {
      return callback(err)
    }

    if (payload) {
      error.code = payload.Code
      error.message = payload.Message || payload.toString()
    }
    callback(error)
  })
}

function onRes (buffer, callback) {
  return function (res) {
    var isJson = res.headers['content-type'] &&
                   res.headers['content-type'].indexOf('application/json') === 0

    if (res.statusCode >= 400 || !res.statusCode) {
      parseError(res, callback)
    }

    if (isJson) {
      return streamToJsonValue(res, callback)
    }

    return streamToValue(res, callback)
  }
}

function requestAPI (config, options, callback) {
  callback = once(callback)
  options.qs = options.qs || {}

  var method = options.method || 'GET'
  var headers = options.header || {}

  var qs = Qs.stringify(options.qs, {
    arrayFormat: 'repeat',
    encoder: function (data, qsDefaultEncoder) {
      if (Buffer.isBuffer(data)) {
        var uriEncoded = ''
        for (var byte of data) {
          // https://tools.ietf.org/html/rfc3986#page-14
          // ALPHA (%41-%5A and %61-%7A), DIGIT (%30-%39), hyphen (%2D), period (%2E), underscore (%5F), or tilde (%7E)
          if (
              (byte >= 0x41 && byte <= 0x5A) ||
              (byte >= 0x61 && byte <= 0x7A) ||
              (byte >= 0x30 && byte <= 0x39) ||
              (byte === 0x2D) ||
              (byte === 0x2E) ||
              (byte === 0x5F) ||
              (byte === 0x7E)
             ) {
            uriEncoded += String.fromCharCode(byte)
          } else {
            var hex = byte.toString(16)
            // String.prototype.padStart() not widely supported yet
            var padded = hex.length === 1 ? "0" + (hex) + "" : hex
            uriEncoded += "%" + (padded) + ""
          }
        }
        return uriEncoded
      }
      return qsDefaultEncoder(data)
    }
  })
  var req = request(config.protocol)({
    hostname: config.host,
    path: "" + (config['api-path']) + "" + (options.path) + "?" + (qs) + "",
    port: config.port,
    method: method,
    headers: headers,
    protocol: "" + (config.protocol) + ":"
  }, onRes(options.buffer, callback))

  req.on('error', function (err) {
    callback(err)
  })

  // if (options.files) { stream.pipe(req) }
  if (options.data) {
    req.write(options.data);
  }

  req.end()

  return req
}

exports = module.exports = function (config) {
  var send = (options, callback) => {
    if (typeof options !== 'object') {
      return callback(new Error('no options were passed'))
    }

    return requestAPI(config, options, callback)
  }

  send.andTransform = (options, transform, callback) => {
    return send(options, (err, res) => {
      if (err) {
        return callback(err)
      }
      transform(res, callback)
    })
  }

  return send
}
