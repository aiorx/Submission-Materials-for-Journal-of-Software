// @ts-check
// DISCLAIMER: Project may contain code and/or comments provided or autocompleted Assisted using common GitHub development aids.
  //
const fs = require('fs');
const path = require('path');

const utils = require('./modules/utils.js');
const locs = require('../lang/en/en.js');

class FileController {
  static write(req, _) {
    const { file: filename } = req.params;
    const { text } = req.query;

    const filepath = path.join(__dirname, '..', 'files', filename);

    fs.exists(filepath, (exists) => {
      if (!exists) fs.writeFileSync(filepath, '');

      fs.appendFile(filepath, text + '\n', () => {});
    });
  }

  static read(req, res) {
    const { file: filename } = req.params;

    const filepath = path.join(__dirname, '..', 'files', filename);

    fs.exists(filepath, (exists) => {
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
    const { name } = req.query;

    if (!name) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(locs.err);
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    const msg = locs.msg
      .replace('%1', name)
      .replace('%2', utils.getDate());

    res.end(`<p style="color: blue">${msg}</p>`);
  }
}

exports.FileController = FileController;
exports.GreetController = GreetController;
