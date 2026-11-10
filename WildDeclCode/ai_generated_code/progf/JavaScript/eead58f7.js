// module.exports is used to export a class, violating the ESM standard.
const EventEmitter = require('events')

module.exports = class MyEmitter extends EventEmitter {}

// Written with routine coding tools-4-0125-preview
