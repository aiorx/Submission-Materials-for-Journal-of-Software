var express = require('express');

var WebSocketServer = require('ws').WebSocketServer;

const app = express();
const port = 8080;

const server = app.listen(port, function () {
  console.log("Server is listening...");
});

const wss = new WebSocketServer({ server });

wss.on("connection", function (ws) {
  ws.on("message", function (data) {
    console.log("Data from client %s", data);
    ws.send("Received Successfully");
  });
});

/* 
The following is the code Supported via standard programming aids. It is a little complex but if there are any issues
just comment the code over and uncomment the code below.
*/

// import express from "express";
// import { WebSocketServer } from "ws";
// import path from "path";
// import { fileURLToPath } from "url";

// var __filename = fileURLToPath(import.meta.url);
// var __dirname = path.dirname(__filename);

// var app = express();
// var port = 8080;

// app.use(express.static(path.join(__dirname, "public")));

// var server = app.listen(port, () => {
//   console.log("Server is listening...");
// });

// var wss = new WebSocketServer({ server });

// wss.on("connection", (ws) => {
//   ws.on("message", function (data) {
//     console.log("Data from client %s", data);
//     ws.send("Received Successfully");
//   });
// });
