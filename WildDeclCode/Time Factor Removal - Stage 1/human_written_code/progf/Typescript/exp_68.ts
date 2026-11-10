var express = require('express');
var router = require('./routes').router;

const app = express();

app.use(express.json());
app.use(router);

module.exports.app = app;
