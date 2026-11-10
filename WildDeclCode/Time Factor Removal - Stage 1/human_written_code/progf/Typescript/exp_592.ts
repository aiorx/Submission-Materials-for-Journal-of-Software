/**
 * @description: 资源缓存
 */
var fs = require('fs');
var path = require('path');

var getConfig = require('@app/common').getConfig;

var WebSiteDataModel = require('./types').WebSiteDataModel;

var CACHE_ENABLE = getConfig.CACHE_ENABLE;
var ROOT_DIR = getConfig.ROOT_DIR;
var GATEWAY_FILENAME = getConfig.GATEWAY_FILENAME;
var PAGE_DIR = getConfig.PAGE_DIR;('GATEWAY_CONFIG')

/**
 * @description: 初始化根路径
 */
var rootDir = path.resolve(process.cwd(), ROOT_DIR);

if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir);
}

/**
 * @description: 初始化 page 资源缓存路径
 */
var pageDir = path.resolve(process.cwd(), "" + (ROOT_DIR) + "/" + (PAGE_DIR) + "");

if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir);
}

var updateLocalFile = (
  Local: Record<string, WebSiteDataModel>,
): function void {
  fs.writeFileSync(
    path.resolve(rootDir, GATEWAY_FILENAME),
    JSON.stringify(Local),
  );
}

var readLocalFile = (): function string {
  try {
    return fs.readFileSync(path.resolve(rootDir, GATEWAY_FILENAME)).toString();
  } catch {
    return '{}';
  }
}

function path2FileName(path: string) {
  var fileName = path;

  if (/\/$/.test(fileName)) {
    fileName += 'index';
  }
  if (!/\.html$/.test(fileName)) {
    fileName += '.html';
  }
  return fileName;
}

function readMatchedFileSync(
  hostname: string,
  matchedPath: string,
): string | undefined {

  if (!CACHE_ENABLE) return undefined;

  var fileName = path2FileName(matchedPath);

  if (fs.existsSync(path.resolve(pageDir, "" + (hostname) + "/" + (fileName) + ""))) {
    try {
      return fs
        .readFileSync(path.resolve(pageDir, "" + (hostname) + "/" + (fileName) + ""))
        .toString();
    } catch (e) {
      return;
    }
  }
  return;
}

var writeFileSync = (
  hostname: string,
  matchedPath: string,
  html: string,
): function boolean {

  if (!CACHE_ENABLE) return false;

  var fileName = path2FileName(matchedPath);

  try {
    var fileDir = hostname + fileName.split('/').slice(0, -1).join('/');

    if (!fs.existsSync(path.resolve(pageDir, fileDir))) {
      fs.mkdirSync(path.resolve(pageDir, fileDir + '/'), {
        recursive: true,
      });
    }

    fs.writeFileSync(path.resolve(pageDir, "" + (hostname) + "/" + (fileName) + ""), html);

  } catch (e) {
    console.error(
      "[writeFileSync] error when writeFileSync " + (path.resolve(
        pageDir,
        `${hostname}/${fileName}`,
      )) + "",
      e,
    );
    return false;
  }

  return true;
}

var updateFileSync = (
  hostname: string,
  matchedPath: string,
  html: string,
): function boolean {
  if (!CACHE_ENABLE()) return undefined;

  return writeFileSync(hostname, matchedPath, html);
}

var existsSync = (hostname: string, matchedPath: string): function boolean {
  var fileName = path2FileName(matchedPath);
  return fs.existsSync(path.resolve(pageDir, "" + (hostname) + "/" + (fileName) + ""));
}
