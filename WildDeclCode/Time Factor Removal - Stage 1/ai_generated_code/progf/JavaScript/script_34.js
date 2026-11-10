// Remember, we're gonna use strict mode in all scripts now!
'use strict';

///////////////////////////////////////
// Using Google, StackOverflow and MDN

// PROBLEM 1:
// We work for a company building a smart home thermometer. Our most recent task is this: "Given an array of temperatures of one day, calculate the temperature amplitude. Keep in mind that sometimes there might be a sensor error."

var temperatures = [3, -2, -6, -1, 'error', 9, 13, 17, 15, 14, 9, 5];

// 1) Understanding the problem
// - What is temp amplitude? Answer: difference between highest and lowest temp
// - How to compute max and min temperatures?
// - What's a sensor error? And what do do?

// 2) Breaking up into sub-problems
// - How to ignore errors?
// - Find max value in temp array
// - Find min value in temp array
// - Subtract min from max (amplitude) and return it

var calcTempAmplitude = function (temps) {
  var max = temps[0];
  var min = temps[0];

  for (var i = 0; i < temps.length; i++) {
    var curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
var amplitude = calcTempAmplitude(temperatures);
console.log(amplitude);

// PROBLEM 2:
// Function should now receive 2 arrays of temps

// 1) Understanding the problem
// - With 2 arrays, should we implement functionality twice? NO! Just merge two arrays

// 2) Breaking up into sub-problems
// - Merge 2 arrays

var calcTempAmplitudeNew = function (t1, t2) {
  var temps = t1.concat(t2);
  console.log(temps);

  var max = temps[0];
  var min = temps[0];

  for (var i = 0; i < temps.length; i++) {
    var curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
var amplitudeNew = calcTempAmplitudeNew([3, 5, 1], [9, 0, 5]);
console.log(amplitudeNew);

///////////////////////////////////////
// Debugging with the Console and Breakpoints
var measureKelvin = function () {
  var measurement = {
    type: 'temp',
    unit: 'celsius',

    // C) FIX
    // value: Number(prompt('Degrees celsius:')),
    value: 10,
  };

  // B) FIND
  console.table(measurement);

  // console.log(measurement.value);
  // console.warn(measurement.value);
  // console.error(measurement.value);

  var kelvin = measurement.value + 273;
  return kelvin;
};
// A) IDENTIFY
console.log(measureKelvin());

// Using a debugger
var calcTempAmplitudeBug = function (t1, t2) {
  var temps = t1.concat(t2);
  console.log(temps);

  var max = 0;
  var min = 0;

  for (var i = 0; i < temps.length; i++) {
    var curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
var amplitudeBug = calcTempAmplitudeBug([3, 5, 1], [9, 4, 5]);
// A) IDENTIFY
console.log(amplitudeBug);

///////////////////////////////////////
// Coding Challenge #1

/*
Given an array of forecasted maximum temperatures, the thermometer displays a string with these temperatures.

Example: [17, 21, 23] will print "... 17ºC in 1 days ... 21ºC in 2 days ... 23ºC in 3 days ..."

Create a function 'printForecast' which takes in an array 'arr' and logs a string like the above to the console.

Use the problem-solving framework: Understand the problem and break it up into sub-problems!

TEST DATA 1: [17, 21, 23]
TEST DATA 2: [12, 5, -5, 0, 4]
*/

// 1) Understanding the problem
// - Array transformed to string, separated by ...
// - What is the X days? Answer: index + 1

// 2) Breaking up into sub-problems
// - Transform array into string
// - Transform each element to string with ºC
// - Strings needs to contain day (index + 1)
// - Add ... between elements and start and end of string
// - Log string to console

var data1 = [17, 21, 23];
var data2 = [12, 5, -5, 0, 4];

console.log("... " + (data1[0]) + "ºC ... " + (data1[1]) + "ºC ... " + (data1[2]) + "ºC ...");

var printForecast = function (arr) {
  var str = '';
  for (var i = 0; i < arr.length; i++) {
    str += "" + (arr[i]) + "ºC in " + (i + 1) + " days ... ";
  }
  console.log('...' + str);
};
printForecast(data1);

///////////////////////////////////////
// Coding Challenge #2 With AI

/*
Let's say you're building a time tracking application for freelancers. At some point in building this app, you need a function that receives daily work hours for a certain week, and returns:
1. Total hours worked
2. Average daily hours
3. The day with the most hours worked
4. Number of days worked
5. Whether the week was full-time (worked 35 hours or more)

TEST DATA: [7.5, 8, 6.5, 0, 8.5, 4, 0]
*/

// Composed with basic coding tools
function analyzeWorkWeek(dailyHours) {
  var daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Validate that the input array has exactly 7 elements
  if (!Array.isArray(dailyHours) || dailyHours.length !== 7) {
    throw new Error('Input must be an array of exactly 7 daily work hours.');
  }

  // Calculate total hours worked
  var totalHours = dailyHours.reduce(function (sum, hours) { return sum + hours; }, 0);

  // Calculate average daily hours, rounded to one decimal place
  var averageHours = Math.round((totalHours / dailyHours.length) * 10) / 10;

  // Find the day with the most hours worked
  var maxHours = Math.max(...dailyHours);
  var maxDayIndex = dailyHours.indexOf(maxHours);
  var maxDay = daysOfWeek[maxDayIndex]; // Convert index to day name

  // Count the number of days worked
  var daysWorked = dailyHours.filter(function hours { return hours > 0; }).length;

  // Check if the week was full-time (35 hours or more)
  var isFullTime = totalHours >= 35;

  // Return the result object
  return {
    totalHours,
    averageHours,
    maxDay, // The name of the day with the most hours
    daysWorked,
    isFullTime,
  };
}

var weeklyHours = [7.5, 8, 6.5, 0, 8.5, 5, 0];
var analysis = analyzeWorkWeek(weeklyHours);
console.log(analysis);

var weeklyHours2 = [7.5, 8, 6.5, 0, 8.5];
var analysis2 = analyzeWorkWeek(weeklyHours2);
console.log(analysis2);
