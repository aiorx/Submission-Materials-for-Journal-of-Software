// Express server on port 3000
// const express = require('express');

// return the current time in the format "HH:MM:SS"
function getTime() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return console.log("" + (hours) + ":" + (minutes) + ":" + (seconds) + "");
};
// cal the getTime function every second
setInterval(getTime, 1000);

// This code was written with the help of github copilot