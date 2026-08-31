// *** prettier.io => docs => configuring prettier => quotes + arrow function parenthesis


// *** (code => Preference => user snippets > new global snippets file)

// *** (Command + D) to select multiple line and change all together.


// Remember, we're gonna use strict mode in all scripts now!
'use strict';


// //////////////////////////////////////////////////
// vid - 55 : setting up prettier and vs code

const x = '23';

if(x === 23) console.log(23);

const calcAge = birthYear => 2037 - birthYear;
console.log(calcAge(1991));

///////////////////////////////////////////////////////
// vid - 59: Using Google, StackOverflow and MDN

// PROBLEM 1:
// We work for a company building a smart home thermometer. Our most recent task is this: "Given an array of temperatures of one day, calculate the temperature amplitude. Keep in mind that sometimes there might be a sensor error."

const temperatures = [3, -2, -6, -1, 'error', 9, 13, 17, 15, 14, 9, 5];

// 1) Understanding the problem
// - What is temp amplitude? Answer: difference between highest and lowest temp
// - How to compute max and min temperatures?
// - What's a sensor error? And what do do?

// 2) Breaking up into sub-problems
// - How to ignore errors?
// - Find max value in temp array
// - Find min value in temp array
// - Subtract min from max (amplitude) and return it

//  3) Writing a Pseudo Code 
// - In case when we are trying to solve a bigger problems, we should put all the previous steps together and write some so-called pseudo-code before writing the actual code.
// - A Pseudo code is simple an informal description of the actual code that we're gonna write. So, it's like code for humans to understand not computers.

// there are no real rules on how to write Pseudo code.

const calcTempAmplitude = function (temps) {
  let max = temps[0];  //  we start comparing from 0 index element cause we assume the first element of the array is the maximum value.
  let min = temps[0]; //  we start comparing from 0 index element cause we assume the first element of the array is the minimum value.

  for (let i = 0; i < temps.length; i++) {
    const curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;  // if the  loops reaches (error) element then it will ignore and continue to the next number cause its not a number. and none of the condition will apply for this (error).

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;  // return the amplitude
};
const amplitude = calcTempAmplitude(temperatures);
console.log(amplitude);

// PROBLEM 2:
// Function should now receive 2 arrays of temps

// 1) Understanding the problem
// - With 2 arrays, should we implement functionality twice? => NO! Just merge two arrays

// 2) Breaking up into sub-problems
// - Merge 2 arrays

const calcTempAmplitudeNew = function (t1, t2) {
  const temps = t1.concat(t2);
  console.log(temps);

  let max = temps[0];
  let min = temps[0];

  for (let i = 0; i < temps.length; i++) {
    const curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
const amplitudeNew = calcTempAmplitudeNew([3, 5, 1], [9, 0, 5]);
console.log(amplitudeNew);

///////////////////////////////////////
// vid - 61 : Debugging with the Console and Breakpoints
const measureKelvin = function () {
  const measurement = {
    type: 'temp',
    unit: 'celsius',

    // error
    // value: prompt('Degrees celsius:'),

    // C) FIX (this)
    value: Number(prompt('Degrees celsius:')),

    // value: 10,
  };

  // B) FIND (the bug)
  console.log(measurement);  // we find that value is "10", but we need number 10, that's why the error is happening.
  console.table(measurement);  // for bigger object it can be helpful

  // console.log(measurement.value);
  // console.warn(measurement.value);
  // console.error(measurement.value);

  const kelvin = measurement.value + 273;
  return kelvin;
};
// A) IDENTIFY (the bug)
console.log(measureKelvin());

// --------------- Using a debugger -------------------

const measureKelvin = function () {
  const measurement = {
    type: 'temp',
    unit: 'celsius',

    // C) FIX (this)
    value: 10,
  };

  // B) FIND (the bug)
  console.table(measurement); 

  const kelvin = measurement.value + 273;
  return kelvin;
};
// A) IDENTIFY (the bug)
console.log(measureKelvin());

// ------------------------------------------------------
// using a debugger
const calcTempAmplitudeBug = function (t1, t2) {
  const temps = t1.concat(t2);
  console.log(temps);


  // * here the debug is here when we give max and min value 0 , cause in max value if we compare with bigger numbers then it will set the max value, but min value is already 0, it's lowest, so there will be no comparison with min value.
  let max = 0;
  let min = 0;

  for (let i = 0; i < temps.length; i++) {
    const curTemp = temps[i];
    if (typeof curTemp !== 'number') continue;

    // instead of go to (Sources) file and do the debug, write (debugger) statement.
    debugger;  // a debugger is actually useful inside of a loop // when the browser sees this debugger, it will automatically open up the debugger tool. go to sources and start debugging. its like a break point
    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
const amplitudeBug = calcTempAmplitudeBug([3, 5, 1], [9, 4, 5]);
// A) IDENTIFY
console.log(amplitudeBug);   // ans is [9, 0] => amplitude = 9

///////////////////////////////////////
// vid - 62:  Coding Challenge #1

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
// - What is the X days? Answer: index + 1 (current index/position of the array) + 1.

// 2) Breaking up into sub-problems
// - Transform array into string
// - Transform each element to string with ºC
// - Strings needs to contain day (index + 1)
// - Add ... between elements and start and end of string
// - Log string to console

const data1 = [17, 21, 23];
const data2 = [12, 5, -5, 0, 4];

console.log(`... ${data1[0]}ºC ... ${data1[1]}ºC ... ${data1[2]}ºC ...`);

const printForecast = function (arr) {
  let str = '';  // in each iteration we will simply add to that string current value of the array. 
  for (let i = 0; i < arr.length; i++) {
    str += `${arr[i]}ºC in ${i + 1} days ... `;  // (string = string + arr[i] => current value of the array of current position, for temperature)  & (i + 1 => current position of the array + 1 (0+1, 1+1, 2+1), for days)
  }
  console.log('...' + str);
};
printForecast(data1);

///////////////////////////////////////
// vid - 64:  Coding Challenge #2 With AI

/*
Let's say you're building a time tracking application for freelancers. write a function called analyzeWorkWeek that receives an array of daily work hours for a certain week, and returns: At some point in building this app, you need a function that receives daily work hours for a certain week, and returns an object with the following data:
1. Total hours worked
2. Average daily hours (round to one decimal place)
3. The day with the most hours worked (assume monday is day 0 in the array)
4. Number of days worked (days with more than 0 hours)
5. Whether the week was full-time (worked 35 hours or more)

TEST DATA: [7.5, 8, 6.5, 0, 8.5, 4, 0]
*/

// Composed with basic coding tools
// Function to analyze a week's work hours
function analyzeWorkWeek(dailyHours) {
// Define an array to map indexes to weekdays (assuming Monday is index 0)
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

   // Validate that the input is an array of exactly 7 elements (one for each day of the week)
   // !Array.isArray(dailyHours) is used to check if dailyHours is not an array.
   // This condition checks whether the input array does not contain exactly 7 elements (one for each day of the week).   If dailyHours.length is not 7, the condition becomes true, and an error is thrown.
  if (!Array.isArray(dailyHours) || dailyHours.length !== 7) {   
    throw new Error('Input must be an array of exactly 7 daily work hours.');
  }

    // Calculate total hours worked by summing up all daily hours (.reduce() is a JavaScript array method used to accumulate values.   sum: Stores the accumulated total (starts at 0).)
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);

    // Calculate the average daily hours, rounding to one decimal place
    // dailyHours.length is 7 (since the array always has 7 elements, one for each day of the week).
    // Multiply the value by 10 to shift the decimal place one step to the right.
    // Use Math.round() to round the number to the nearest integer.
    // Divide the result by 10 to shift the decimal place back to its correct position.
  const averageHours = Math.round((totalHours / dailyHours.length) * 10) / 10;

  // Determine the maximum number of hours worked in a single day
  // Math.max() is a JavaScript function that returns the largest value among its arguments.
  // The spread operator (...) is used to pass all elements of dailyHours as separate arguments to Math.max().
  //This function helps identify which day had the highest work hours.
  const maxHours = Math.max(...dailyHours);

  // Find the index of the first occurrence of the maxHours in the array
  //.indexOf(value) is a JavaScript array method that returns the first index where value appears in the array.
  // maxHours is the maximum number of hours worked in a single day, which we previously found using:
  const maxDayIndex = dailyHours.indexOf(maxHours);
  // Retrieve the corresponding day of the week using the index
  //maxDayIndex represents the index of the day with the most work hours.
  // By accessing daysOfWeek[maxDayIndex], we retrieve the corresponding weekday.
  const maxDay = daysOfWeek[maxDayIndex]; // Convert index to day name

  
  // Count the number of days where the freelancer worked (i.e., days with more than 0 hours)
  // .filter() is a JavaScript array method that returns a new array containing only elements that satisfy a given condition.
  // The condition hours > 0 ensures only days with more than 0 work hours are included in the new array.
  // This filters out days where no work was done (0 hours).
  // .length gives the number of elements in the filtered array, which represents the number of days worked.
  const daysWorked = dailyHours.filter(hours => hours > 0).length;

  // Check if the total hours worked is 35 or more (full-time threshold)
  // This comparison operator (>=) checks if totalHours is greater than or equal to 35.
  // If totalHours is 35 or more, the result is true (full-time).
  // Otherwise, it returns false (not full-time).
  const isFullTime = totalHours >= 35;

  
  // Return an object containing all the calculated results
  return {
    totalHours,  // Total hours worked in the week : 34
    averageHours,  // Average daily hours, rounded to one decimal place : 4.9
    maxDay, // The name of the day with the most hours worked : "Friday"
    daysWorked, // Number of days worked : 5
    isFullTime,  // Boolean indicating if it was a full-time week : false
  };
}

// Example test case: work hours for a full week
const weeklyHours = [7.5, 8, 6.5, 0, 8.5, 4, 0];
// Call the function and store the result in a variable
const analysis = analyzeWorkWeek(weeklyHours);
// Print the results
console.log(analysis); // Output: { totalHours: 35.5, averageHours: 5.1, maxDay: 'Friday', daysWorked: 5, isFullTime: true }

// Example test case with an incorrect input (less than 7 days)
const weeklyHours2 = [7.5, 8, 6.5, 0, 8.5];
// This will throw an error due to incorrect input length
const analysis2 = analyzeWorkWeek(weeklyHours2);
console.log(analysis2);



// ------------- full code -------------
function analyzeWorkWeek(dailyHours) {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    if (!Array.isArray(dailyHours) || dailyHours.length !== 7) {   
      throw new Error('Input must be an array of exactly 7 daily work hours.');
    }
    const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
    const averageHours = Math.round((totalHours / dailyHours.length) * 10) / 10;
    const maxHours = Math.max(...dailyHours);

    const maxDayIndex = dailyHours.indexOf(maxHours);
    
    const maxDay = daysOfWeek[maxDayIndex]; 
    const daysWorked = dailyHours.filter(hours => hours > 0).length;
  
    const isFullTime = totalHours >= 35;

    return {
      totalHours, 
      averageHours,
      maxDay,
      daysWorked, 
      isFullTime,
    };
  }
  const weeklyHours = [7.5, 8, 6.5, 0, 8.5, 4, 0];
  const analysis = analyzeWorkWeek(weeklyHours);
  console.log(analysis);
  const weeklyHours2 = [7.5, 8, 6.5, 0, 8.5];
  const analysis2 = analyzeWorkWeek(weeklyHours2);
  console.log(analysis2);