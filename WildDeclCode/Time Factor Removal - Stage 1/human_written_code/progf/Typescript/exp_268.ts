var parse = require('./parse').parse;
var SFCBlock = require('./parse').SFCBlock;
var SFCCustomBlock = require('./parse').SFCCustomBlock;
var SFCDescriptor = require('./parse').SFCDescriptor;

import {
  compileTemplate,
  TemplateCompileOptions,
  TemplateCompileResult
} from './compileTemplate'

import {
  compileStyle,
  compileStyleAsync,
  StyleCompileOptions,
  StyleCompileResults
} from './compileStyle'

// API
module.exports.parse = parse;
module.exports.compileTemplate = compileTemplate;
module.exports.compileStyle = compileStyle;
module.exports.compileStyleAsync = compileStyleAsync;

// types
export {
  SFCBlock,
  SFCCustomBlock,
  SFCDescriptor,
  TemplateCompileOptions,
  TemplateCompileResult,
  StyleCompileOptions,
  StyleCompileResults
}
