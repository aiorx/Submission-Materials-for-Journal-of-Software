var Schema = require('mongoose').Schema;
var model = require('mongoose').model;

let schema: Schema = new Schema({
    title: String,
    subtitle: String
});

module.exports = model('Example', schema);
