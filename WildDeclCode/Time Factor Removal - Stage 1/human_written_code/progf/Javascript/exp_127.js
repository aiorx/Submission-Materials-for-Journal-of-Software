// vim: set ft=javascript:

var fs = require('fs');
var path = require('path');
var config = require('../i18n.config')();

var dir = config.targetDir;

var targetPath = "" + (dir) + "/zh_CN.js";
var srcPath = path.join(process.cwd(), dir, 'zh-CH.json');
var data = [];
try {
  data = require(srcPath);
} catch(e) {
  console.log('获取映射文件出错！', e);
  return;
}
var result = {};
data.forEach(function d {
  if (result[d.id]) return console.log('"' + (d.defaultMessage) + '"与"' + (result[d.id]) + '" key 值相同，请修改！');
  result[d.id] = d.defaultMessage
});
// DONE: 重写 targetPath 文件
fs.writeFile(targetPath, JSON.stringify(result, null, '\t'), function(err) {
  if (err) return console.error(err);
  console.log('----导出到 zh_CN.js ----')
})
