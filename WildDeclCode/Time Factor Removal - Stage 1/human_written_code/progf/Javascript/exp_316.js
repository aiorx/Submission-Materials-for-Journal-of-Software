/*ziye爱尚打卡

非常重要！！！   

微信扫码  https://raw.githubusercontent.com/ziye12/JavaScript/master/asdkziye.png 进入小程序，登录获取授权，再启动软件获取ck 
建议设置6点到23点之间打卡，时间间隔30分钟以上,否则容易封号



《《《《《《《《《《制作其他打卡js的说明

抓包小程序，然后替换以下内容来制作其他打卡js，
需要替换的内容如下，按顺序替换字符，自己用电脑或者KODE软件替换，KODE下载链接https://apps.apple.com/cn/app/koder-code-editor/id1447489375

ph0001.hezyq.com
爱尚打卡
cs = 20
xj = 1
asdkurl
i=971
asdk

手动替换
ph0001\.hezyq\.com

制作其他打卡js的说明》》》》》》》》》》》






////////////////////////////////////////正文


使用说明： 
一，微信扫码  https://raw.githubusercontent.com/ziye12/JavaScript/master/asdkziye.png 进入小程序，登录获取授权

二，然后将hostname复制粘贴进配置文件

三，将重写复制到 rewrite_local 下，再进入程序获取ck，建议 放入新建配置片段，获取之后禁用即可

功能如下：
1.每日打卡，设置了开关，完成任务不再打卡
2.打卡币统计，
3.现金统计，自动提现





hostname= ph0001.hezyq.com,

//surge
爱尚打卡 = type=http-request,pattern=^https:\/\/ph0001\.hezyq\.com\/*,requires-body=1,max-size=0,script-path= https://raw.githubusercontent.com/ziye12/JavaScript/master/asdkziye.js

//圈x
https:\/\/ph0001\.hezyq\.com\/* url script-request-header https://raw.githubusercontent.com/ziye12/JavaScript/master/asdkziye.js

//loon
http-request ^https:\/\/ph0001\.hezyq\.com\/* script-path= https://raw.githubusercontent.com/ziye12/JavaScript/master/asdkziye.js
, requires-body=true, timeout=10, tag=爱尚打卡


*/



var sy = init()//声明必须
var notifyInterval = 1; //通知开为1，常关为0
var logs = 0; // 日志开关
var jsname = '爱尚打卡'
var jbid =1
var sb='失败,请先关闭,进入程序获取授权'

var cs = 20;//小程序打卡次数
var xj = 1;//提现标准
var tz=''

var dkurlkey = 'asdkurl'+jbid
var dkurl = sy.getdata(dkurlkey)


var isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}


 
function GetCookie() {
if ($request && $request.url.match(/i=971&/))
if ($request && $request.url.match(/action=today&contr=index/))
 {
  var dkurl =  $request.url
  sy.log("dkurl:" + (dkurl) + "")
  if (dkurl) sy.setdata(dkurl, dkurlkey)
  sy.msg(dkurlkey, "获取cookie: 成功🎉", "")
}

}
  

//异步运行


function all()

 {

   for(var i=0;i<3;i++)
 { (function(i) {
            setTimeout(function() {
    
     if(i==0) dktj(i);
else if(i==1) dkxj(i); 
else if(i==2) showmsg(i);
}, (i + 1) * 1000);
                })(i)


}}




//统计

function dktj() {
return new Promise(function (resolve, reject) {

  var Tjurl = {
    url: dkurl
	 };
   sy.get(Tjurl,(error, response, data) =>{
     if(logs)sy.log("" + (jsname) + "1统计 - data: " + (data) + "")
       obj = JSON.parse(data)
if(obj.status == 1 && obj.info.today.clock <  cs){tz+="[账户信息]🎉"+"\n"+
"今日已打卡"+[Number(obj.info.today.clock) ]+"/"+cs+"次"+"余"+[Number(obj.info.today. currency)]+"币"+"\n"
 }else tz+="[打卡完成]"+"余"+[Number(obj.info.today. currency)]+"币"+"\n"


 


cstj1(obj.info.today.clock);



    resolve()
    })
   })
  }  


//次数统计


function cstj1(tjtj)
{
if (tjtj<cs)
dkdk();


}


//现金

function dkxj() {
return new Promise(function (resolve, reject) {

  var Xjurl = {
    url: dkurl.replace(/action=today&contr=index/g, "action=index&contr=my")
	 };
   sy.get(Xjurl,(error, response, data) =>{
     if(logs)sy.log("" + (jsname) + "1现金 - data: " + (data) + "")
       obj = JSON.parse(data)
if(obj.status ==  1)   {




       tz +="💵现金余额"+
obj.info.member.money+"元"+"\n"
 
 }

    else tz +=sb+"\n";


xjtj1(obj.info.member.money);



    resolve()
    })
   })
  }  




//自动提现

function dktx() {
return new Promise(function (resolve, reject) {

  var Txurl = {
    url: dkurl.replace(/action=today&contr=index/g, "action=withdrawals&contr=my&money=" + (xj) + "&payment_code=")
	 };
   sy.get(Txurl,(error, response, data) =>{
     if(logs)sy.log("" + (jsname) + "1提现 - data: " + (data) + "")
       obj = JSON.parse(data)
if(obj.status ==  1)   {

tz +='提现成功，成功提现'+xj+'元'+"\n"
 
 }

if(obj.status ==  2)   {

tz +='提现失败,原因:'+obj.info+"\n"
 
 }




    resolve()
    })
   })
  }  



//现金统计


function xjtj1(tjtj)
{
if (tjtj>=xj)
dktx()

}



//打卡
function dkdk() {
return new Promise(function (resolve, reject) {

  var Dkurl = {
    url: dkurl.replace(/action=today&contr=index/g, "action=sign&contr=clock")
	 };
   sy.get(Dkurl,(error, response, data) =>{
     if(logs)sy.log("" + (jsname) + "1打卡- data: " + (data) + "")
       obj = JSON.parse(data)

   if (obj.status==1){
tz+='[️打卡任务]:'+'打卡次数+1'+'\n'

    }
else tz +=obj.info+'\n'


    resolve()
    })
   })
  }  


function showmsg() {

console.log(tz)

if (notifyInterval==1)
sy.msg(jsname,'',tz)
}


function init() {
  isSurge = function () {
    return undefined !== this.$httpClient
  }
  isQuanX = function () {
    return undefined !== this.$task
  }
  getdata = function (key) {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = function (key, val) {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = function (title, subtitle = '', body = '') {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = function (msg) {
    console.log("" + (msg) + "\n")
  }
  get = function (options, callback) {
    if (isQuanX()) {
      if (typeof options == 'string') options = { url: options }
      options['method'] = 'GET'
      return $task.fetch(options).then(
        (response) => {
          response['status'] = response.statusCode
          callback(null, response, response.body)
        },
        (reason) => callback(reason.error, null, null)
      )
    }
    if (isSurge()) return $httpClient.get(options, callback)
  }
  post = function (options, callback) {
    if (isQuanX()) {
      if (typeof options == 'string') options = { url: options }
      options['method'] = 'POST'
      $task.fetch(options).then(
        (response) => {
          response['status'] = response.statusCode
          callback(null, response, response.body)
        },
        (reason) => callback(reason.error, null, null)
      )
    }
    if (isSurge()) $httpClient.post(options, callback)
  }
  done = function (value = {}) {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
