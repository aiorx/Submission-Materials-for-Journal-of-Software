// Importing multiple named exports from a module
var join = require('path').join;
var resolve = require('path').resolve;

// This is correct because it uses the ESM syntax for importing named exports
var fullPath = join(resolve(), 'src', 'index.js')

module.exports.fullPath = fullPath;

// Built using basic development resources-4-0125-preview
