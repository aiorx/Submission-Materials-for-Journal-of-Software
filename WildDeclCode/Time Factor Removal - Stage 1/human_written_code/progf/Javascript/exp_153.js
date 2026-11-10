"use strict";
var env = require("./env.json");
Object.assign(process.env, env);

var ethers = require("ethers");
var provider = new ethers.providers.WebSocketProvider(
  process.env.BSC_NODE_WSS
);
var wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
var account = wallet.connect(provider);

var run = async function () {
  var balance = await provider.getBalance(process.env.RECIPIENT);
  console.log(ethers.utils.formatEther(balance));
  process.exit();
};
run();
