var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var config = require('config-lite');
var db = require('./mongodb/db.js');
var router = require('./routes/index.js');
var chalk = require('chalk');

const app = express();

// 用于接收post参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// 用于接收cookie
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: '30 days'
}));

app.get('/',function (req, res, next) {
	res.send('欢迎访问elm-api后台系统，<a href="https://easytuan.gitee.io/node-elm-api/doc" target="_blank">API文档地址</a>');
})

router(app);

app.use(function (req, res, next) {
	res.send(404);
})

app.listen(config.port, function () {
	console.log(
		chalk.green("成功监听端口：" + (config.port) + "")
	)
});