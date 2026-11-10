var requireMemoRule = require('./require-memo');
var requireUseMemoRule = require('./require-usememo');
var requireUseMemoChildrenRule = require('./require-usememo-children');

const rules = {
  "require-memo": requireMemoRule,
  "require-usememo": requireUseMemoRule,
  "require-usememo-children": requireUseMemoChildrenRule,
};
