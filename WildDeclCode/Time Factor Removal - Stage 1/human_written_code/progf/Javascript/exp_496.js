// vim: set ft=javascript:

var fs = require('fs');
var program = require('commander');
var path = require('path');
var config = require('../i18n.config')();

program.parse(process.argv);


var needImport = [];
var importStatement = config.importStatement;
var callStatement = config.callStatement;
var targetDir = config.targetDir;
var sourceMapPath = path.join(process.cwd(), targetDir, 'zh-CH.json');


function replace(text, chinese, replaceString) {
    var textArr = text.split(/intl\.get\(.+?\)/);
    var newArr = JSON.parse(JSON.stringify(textArr));
    textArr.forEach(function (item, index, arr) {
        arr[index] = item.replace(chinese, replaceString);
    });
    newArr.forEach(function (item, index, arr) {
        if (item !== textArr[index]) {
            text = text.replace(item, textArr[index]);
        }
    })
    return text;
}

function generateAndWrite(sourceObj) {
    if (!sourceObj) return;
    var key = sourceObj.key;
var text = sourceObj.text;
var textType = sourceObj.textType;
var filename = sourceObj.filename;
var line = sourceObj.line;
var column = sourceObj.column;

    var left = textType == 'jsx' ? '{' : '';
    var right = textType == 'jsx' ? '}' : '';

    // 拿到文件数据
    var data = fs.readFileSync(filename, 'utf8');
    var arr = data.split('\n');

    var temp1 = arr[line - 1];
    var temp2 = arr[line];
    var chinese = text.replace(/\\"/g, '"');
    var replaceString = "" + (left) + "" + (callStatement) + "('" + (key) + "')" + (right) + "";
    // 这里是为了匹配前后如果有引号的情况
    arr[line - 1] = replace(arr[line - 1], '"' + (chinese) + '"', replaceString);
    if (temp1 === arr[line - 1]) {
        arr[line - 1] = replace(arr[line - 1], "'" + (chinese) + "'", replaceString);
        if (temp1 === arr[line - 1]) {
            arr[line - 1] = replace(arr[line - 1], chinese, replaceString);
            if (temp1 === arr[line - 1]) {
                arr[line] = replace(arr[line], '"' + (chinese) + '"', replaceString);
                if (temp2 === arr[line]) {
                    arr[line] = replace(arr[line], "'" + (chinese) + "'", replaceString);
                    if (temp2 === arr[line]) {
                        arr[line] = replace(arr[line], chinese, replaceString);
                        if (temp2 === arr[line]) {
                            if (arr[line].indexOf(text) !== -1 ||
                                arr[line - 1].indexOf(text) !== -1) {
                                console.log('失败，请手动替换', JSON.stringify(sourceObj, null, "\t"));
                                return 0;
                            }
                        }
                    }
                }
            }
        }
    }

    var result = arr.join('\n');
    if (needImport.indexOf(filename) === -1 && arr.indexOf(importStatement) === -1) {
        needImport.push(filename);
    }

    fs.writeFileSync(filename, result, 'utf8');
    return 1;
}


var data = null;
try {
    data = require(sourceMapPath);
} catch(e) {
    console.log('获取映射文件出错！', e);
return;
}

data.forEach(function item {
    item.source.forEach(src=>{
        var [filename, line, column] = src.location.split('#');
        var opts = {
            key: item.id,
            text: item.defaultMessage,
            textType: src.type,
            filename: filename,
            line: line,
            column: column
        };
        var flag = generateAndWrite(opts);
        if (flag) {
            console.log('替换成功，'+opts.text+' => '+opts.key+' #'+src.location);
        }
    })
});

// 这里加上文件头的import
needImport.forEach(function src {
    fs.readFile(src, 'utf8', (err, data) => {
        if (err) return console.log(err);

        var result = "" + (importStatement) + "\n" + (data) + "";
        fs.writeFile(src, result, 'utf8', e => {
            if (e) return console.log(e);
            return 1;
        });
        return 1;
    });
});
