// Importing a default export from a module
var express = require('express');

var app = express()

// This is correct because it uses the ESM syntax for importing the default export
app.get('/', function (req, res) {
  res.send('Hello World!')
})

module.exports = app;

// Built using basic development resources-4-0125-preview
