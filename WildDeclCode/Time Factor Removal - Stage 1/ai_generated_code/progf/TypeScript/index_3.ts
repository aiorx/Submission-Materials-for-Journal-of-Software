// Supported via standard GitHub programming aids
/**
 * NEAT-TS main library entry point
 * @module index
 */

var architect = require('./architecture/architect');
var Connection = require('./architecture/connection');
var Group = require('./architecture/group');
var Layer = require('./architecture/layer');
var Network = require('./architecture/network');
var Node = require('./architecture/node');
var config = require('./config');
var methods = require('./methods/methods');
var multi = require('./multithreading/multi');
var Neat = require('./neat');

var NeatJS = {
  methods,
  Connection,
  architect,
  Network,
  config,
  Group,
  Layer,
  Node,
  Neat,
  multi,
};

module.exports = NeatJS;
