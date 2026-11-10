/**
 * server.js
 *
 * 本服务器为 EHGroupTagger 提供支持，主要负责以下功能：
 *
 * 1. 接收用户脚本发送的同人志页面数据，包括 URL、标题、标签等信息。
 * 2. 将接收到的数据插入到相应的数据库表中，如 TagDetails 和 WebPageRequestCredentials。
 * 3. 当记录已存在时，根据 URL 更新该记录。
 * 4. 提供一个简单的 REST API，用于接收和处理发送到服务器的数据。
 *
 * 安装依赖及运行：
 * 1. 安装 Node.js。
 * 2. 使用 npm 安装所需依赖（例如：npm install mysql2 express cors 等）。
 * 3. 运行 server.js 以启动服务器（例如：node server.js），默认监听端口 3000。
 *
 * fully Formed using standard development resources-4-0314
 * create date 2023-09-13
 */

var express = require("express");
var cors = require("cors");
var app = express();
var port = 3000;
var mysql = require("mysql2");
var prompt = require("prompt");
var testMode = false;

prompt.start();
prompt.get(["password"], function (err, result) {
    if (err) {
        console.error("PASSWORD INPUT ERR", err);
        return;
    }

    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: result.password,
        database: "ehentaiData",
    });

    connection.connect((err) => {
        if (err) {
            console.error("CONNECT TO MYSQL FAILED", err);
            return;
        }
        console.log("CONNECT TO MYSQL SUCCEED");
    });


    app.use(cors());
    app.use(express.json());

    app.post("/save-data", (req, res) => {
        if (testMode) {
            console.log("Data received: ", req.body);
        }
        var URL = req.body.URL;
var UniqueID = req.body.UniqueID;
var AntiSpiderString = req.body.AntiSpiderString;
var RomanjiTitle = req.body.RomanjiTitle;
var KanjiTitle = req.body.KanjiTitle;
var tagsInClickboard = req.body.tagsInClickboard;
var tagsToDatabaseSystem = req.body.tagsToDatabaseSystem;
var userAgent = req.body.userAgent;
var cookie = req.body.cookie;
var apikey = req.body.apikey;
var messageType = req.body.messageType;

        // "TagDetails"
        if (messageType === "TagDetails") {
            var queryTagDetails = "
        INSERT INTO TagDetails (URL, UniqueID, AntiSpiderString, RomanjiTitle, KanjiTitle, tagsInClickboard, tagsToDatabaseSystem, messageType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
        URL = VALUES(URL), UniqueID = VALUES(UniqueID), AntiSpiderString = VALUES(AntiSpiderString), 
        RomanjiTitle = VALUES(RomanjiTitle), KanjiTitle = VALUES(KanjiTitle), 
        tagsInClickboard = VALUES(tagsInClickboard), tagsToDatabaseSystem = VALUES(tagsToDatabaseSystem),
        messageType = VALUES(messageType), updated_at = NOW()";
            connection.query(
                queryTagDetails,
                [
                    URL,
                    UniqueID,
                    AntiSpiderString,
                    RomanjiTitle,
                    KanjiTitle,
                    tagsInClickboard,
                    tagsToDatabaseSystem,
                    messageType,
                ],
                (err, results) => {
                    if (err) {
                        if (testMode) {
                            console.error("INSERT TagDetails FAILED", err);
                        }
                        res.send({status: "failed", error: err});
                        return;
                    }
                    if (testMode) {
                        console.log("INSERT TagDetails SUCCEED", results);
                    }
                    res.send({status: "success"});
                }
            );
        } else if (messageType === "WebPageRequestCredentials") {
            var queryWebPageRequestCredentials = "
          INSERT INTO WebPageRequestCredentials (URL, userAgent, cookie, apikey, messageType)
          VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
          URL = VALUES(URL), userAgent = VALUES(userAgent), cookie = VALUES(cookie), apikey = VALUES(apikey), messageType = VALUES(messageType)";

            connection.query(
                queryWebPageRequestCredentials,
                [URL, userAgent, cookie, apikey, messageType],
                (err, results) => {
                    if (err) {
                        if (testMode) {
                            console.error("INSERT WebPageRequestCredentials FAILED", err);
                        }
                        res.send({status: "failed", error: err});
                        return;
                    }
                    if (testMode) {
                        console.log("INSERT WebPageRequestCredentials SUCCEED", results);
                    }
                    res.send({status: "success"});
                }
            );
        } else {
            res.send({status: "failed", error: "Invalid messageType"});
        }
    });

    process.on("SIGINT", () => {
        console.log("关闭数据库连接");
        connection.end();
        process.exit();
    });
    app.listen(port, () => {
        console.log("Server listening at http://localhost:" + (port) + "");
    });
});
