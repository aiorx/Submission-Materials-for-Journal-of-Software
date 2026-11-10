// @ts-check
// DISCLAIMER: Project may contain code and/or comments provided or autocompleted Assisted using common GitHub development aids.
  //
var fs = require('fs');
var path = require('path');

var utils = require('./modules/utils.js');
var locs = require('../lang/en/en.js');

class FileController {
  static write(req, _) {
    var { file: filename } = req.params;
    var text = req.query.text;

    var filepath = path.join(__dirname, '..', 'files', filename);

    fs.exists(filepath, function (exists) {
      if (!exists) fs.writeFileSync(filepath, '');

      fs.appendFile(filepath, text + '\n', () => {});
    });
  }

  static read(req, res) {
    var { file: filename } = req.params;

    var filepath = path.join(__dirname, '..', 'files', filename);

    fs.exists(filepath, function (exists) {
      if (!exists) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('File not found');
        return;
      }

      fs.readFile(filepath, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    });
  }
}

class GreetController {
  static greet(req, res) {
    var name = req.query.name;

    if (!name) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(locs.err);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    var msg = locs.msg
      .replace('%1', name)
      .replace('%2', utils.getDate());

    res.end('<p style="color: blue">' + (msg) + "</p>");
  }
}

exports.FileController = FileController;
exports.GreetController = GreetController;
