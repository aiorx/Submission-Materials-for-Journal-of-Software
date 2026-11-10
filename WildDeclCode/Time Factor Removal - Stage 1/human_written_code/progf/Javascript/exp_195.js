/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */

// 数据来源 https://github.com/jihongboo/wast_sortting_helper_wechat/blob/master/miniprogram/resources/result.js
var Logger = require('../../utils/logger');
var category = require('../../utils/category');
var datebase = require('../../utils/database');
var data = require('./data');

var logger = Logger.getLogger();

var TYPES = {
  1: category.HOUSEHOLD_FOOD,
  2: category.RESIDUAL,
  3: category.RECYCLEABLE,
  4: category.HAZARDOUS,
};

async function main() {
  logger.trace('开始处理数据');
  var datas = Object.values(data.data);
  for (var i = 0; i < datas.length; i++) {
    var items = datas[i];
    for (var j = 0, len = items.length; j < len; j++) {
      var item = items[j];
      var garbage = {
        name: item.n,
        category: TYPES[item.c],
      };
      var resp = await datebase.insert(garbage);
      if (resp[0]) {
        logger.warn("insert: " + (resp[0].message) + "");
        resp = await datebase.update(garbage);
        if (resp[0]) {
          logger.warn("update: " + (resp[0].message) + "");
        } else {
          logger.info('updated', garbage);
        }
      } else {
        logger.info('inserted', garbage);
      }
    }
  }
  logger.trace('处理完成');
}

main();
