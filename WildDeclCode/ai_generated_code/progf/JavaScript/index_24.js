// vid - 16: Coding Challenge #1

/*
Mark and John are trying to compare their BMI (Body Mass Index), which is calculated using the formula: BMI = mass / height ** 2 = mass / (height * height). (mass in kg and height in meter).

1. Store Mark's and John's mass and height in variables
2. Calculate both their BMIs using the formula (you can even implement both versions)
3. Create a boolean variable 'markHigherBMI' containing information about whether Mark has a higher BMI than John.

TEST DATA 1: Marks weights 78 kg and is 1.69 m tall. John weights 92 kg and is 1.95 m tall.
TEST DATA 2: Marks weights 95 kg and is 1.88 m tall. John weights 85 kg and is 1.76 m tall.

GOOD LUCK 😀
*/

const massMark = 78;
const heightMark = 1.69;
const massJohn = 92;
const heightJohn = 1.95;

const massMark = 95;
const heightMark = 1.88;
const massJohn = 85;
const heightJohn = 1.76;

const BMIMark = massMark / heightMark ** 2;
const BMIJohn = massJohn / (heightJohn * heightJohn);
const markHigherBMI = BMIMark > BMIJohn;

console.log(BMIMark, BMIJohn, markHigherBMI);

// vid - 19: Coding Challenge #2

/*
Use the BMI example from Challenge #1, and the code you already wrote, and improve it:

1. Print a nice output to the console, saying who has the higher BMI. The message can be either "Mark's BMI is higher than John's!" or "John's BMI is higher than Mark's!"
2. Use a template literal to include the BMI values in the outputs. Example: "Mark's BMI (28.3) is higher than John's (23.9)!"

HINT: Use an if/else statement 😉

GOOD LUCK 😀
*/

const massMark = 78;
const heightMark = 1.69;
const massJohn = 92;
const heightJohn = 1.95;

// const massMark = 95;
// const heightMark = 1.88;
// const massJohn = 85;
// const heightJohn = 1.76;

const BMIMark = massMark / heightMark ** 2;
const BMIJohn = massJohn / (heightJohn * heightJohn);
console.log(BMIMark, BMIJohn);

if (BMIMark > BMIJohn) {
  console.log(`Mark's BMI (${BMIMark}) is higher than John's (${BMIJohn})!`);
} else {
  console.log(`John's BMI (${BMIJohn}) is higher than Marks's (${BMIMark})!`);
}

// vid - 25: Coding Challenge #3

/*
There are two gymnastics teams, Dolphins and Koalas. They compete against each other 3 times. The winner with the highest average score wins the a trophy!

1. Calculate the average score for each team, using the test data below
2. Compare the team's average scores to determine the winner of the competition, and print it to the console. Don't forget that there can be a draw, so test for that as well (draw means they have the same average score).

3. BONUS 1: Include a requirement for a minimum score of 100. With this rule, a team only wins if it has a higher score than the other team, and the same time a score of at least 100 points. HINT: Use a logical operator to test for minimum score, as well as multiple else-if blocks 😉
4. BONUS 2: Minimum score also applies to a draw! So a draw only happens when both teams have the same score and both have a score greater or equal 100 points. Otherwise, no team wins the trophy.

TEST DATA: Dolphins score 96, 108 and 89. Koalas score 88, 91 and 110
TEST DATA BONUS 1: Dolphins score 97, 112 and 101. Koalas score 109, 95 and 123
TEST DATA BONUS 2: Dolphins score 97, 112 and 101. Koalas score 109, 95 and 106

GOOD LUCK 😀
*/

const scoreDolphins = (96 + 108 + 89) / 3;
const scoreKoalas = (88 + 91 + 110) / 3;
console.log(scoreDolphins, scoreKoalas);

if (scoreDolphins > scoreKoalas) {
  console.log("Dolphins win the trophy 🏆");
} else if (scoreKoalas > scoreDolphins) {
  console.log("Koalas win the trophy 🏆");
} else if (scoreDolphins === scoreKoalas) {
  console.log("Both win the trophy!");
}

// BONUS 1
const scoreDolphins = (97 + 112 + 80) / 3;
const scoreKoalas = (109 + 95 + 50) / 3;
console.log(scoreDolphins, scoreKoalas);

if (scoreDolphins > scoreKoalas && scoreDolphins >= 100) {
  console.log("Dolphins win the trophy 🏆");
} else if (scoreKoalas > scoreDolphins && scoreKoalas >= 100) {
  console.log("Koalas win the trophy 🏆");
} else if (
  scoreDolphins === scoreKoalas &&
  scoreDolphins >= 100 &&
  scoreKoalas >= 100
) {
  console.log("Both win the trophy!");
} else {
  console.log("No one wins the trophy 😭");
}

// vid - 29: Coding Challenge #4

/*
Steven wants to build a very simple tip calculator for whenever he goes eating in a resturant. In his country, it's usual to tip 15% if the bill value is between 50 and 300. If the value is different, the tip is 20%.

1. Your task is to caluclate the tip, depending on the bill value. Create a variable called 'tip' for this. It's not allowed to use an if/else statement 😅 (If it's easier for you, you can start with an if/else statement, and then try to convert it to a ternary operator!)
2. Print a string to the console containing the bill value, the tip, and the final value (bill + tip). Example: 'The bill was 275, the tip was 41.25, and the total value 316.25'

TEST DATA: Test for bill values 275, 40 and 430

HINT: To calculate 20% of a value, simply multiply it by 20/100 = 0.2
HINT: Value X is between 50 and 300, if it's >= 50 && <= 300 😉

GOOD LUCK 😀
*/

const bill = 430;
const tip = bill <= 300 && bill >= 50 ? bill * 0.15 : bill * 0.2;
console.log(
  `The bill was ${bill}, the tip was ${tip}, and the total value ${bill + tip}`
);

///////////////////////////////////////
// vid - 38: Coding Challenge #1

/*
  Back to the two gymnastics teams, the Dolphins and the Koalas! There is a new gymnastics discipline, which works differently.
  Each team competes 3 times, and then the average of the 3 scores is calculated (so one average score per team).
  A team ONLY wins if it has at least DOUBLE the average score of the other team. Otherwise, no team wins!
  
  1. Create an arrow function 'calcAverage' to calculate the average of 3 scores
  2. Use the function to calculate the average for both teams
  3. Create a function 'checkWinner' that takes the average score of each team as parameters ('avgDolhins' and 'avgKoalas'), and then logs the winner to the console, together with the victory points, according to the rule above. Example: "Koalas win (30 vs. 13)".
  4. Use the 'checkWinner' function to determine the winner for both DATA 1 and DATA 2.
  5. Ignore draws this time.
  
  TEST DATA 1: Dolphins score 44, 23 and 71. Koalas score 65, 54 and 49
  TEST DATA 2: Dolphins score 85, 54 and 41. Koalas score 23, 34 and 27
  
  HINT: To calculate average of 3 values, add them all together and divide by 3
  HINT: To check if number A is at least double number B, check for A >= 2 * B. Apply this to the team's average scores 😉
  
  GOOD LUCK 😀
  */

const calcAverage = (a, b, c) => (a + b + c) / 3;
console.log(calcAverage(3, 4, 5));

// Test 1
let scoreDolphins = calcAverage(44, 23, 71);
let scoreKoalas = calcAverage(65, 54, 49);
console.log(scoreDolphins, scoreKoalas);

const checkWinner = function (avgDolphins, avgKoalas) {
  if (avgDolphins >= 2 * avgKoalas) {
    console.log(`Dolphins win 🏆 (${avgDolphins} vs. ${avgKoalas})`);
  } else if (avgKoalas >= 2 * avgDolphins) {
    console.log(`Koalas win 🏆 (${avgKoalas} vs. ${avgDolphins})`);
  } else {
    console.log("No team wins...");
  }
};
checkWinner(scoreDolphins, scoreKoalas);

checkWinner(576, 111);

// Test 2
scoreDolphins = calcAverage(85, 54, 41);
scoreKoalas = calcAverage(23, 34, 27);
console.log(scoreDolphins, scoreKoalas);
checkWinner(scoreDolphins, scoreKoalas);

///////////////////////////////////////
// vid - 39: Introduction to Arrays

// * * * arrays are also an object.
// *** In Javascript everything is object.

const friend1 = "Michael";
const friend2 = "Steven";
const friend3 = "Peter";

const friends = ["Michael", "Steven", "Peter"];
console.log(friends);

const years = new Array(1991, 1984, 2008, 2020);

console.log(friends[0]);
console.log(friends[2]);

// how many element are there in the array
console.log(friends.length);

// to get last element in the array
console.log(friends[friends.length - 1]);

// ** we can change the elements of array even it is start with const. but we cannot change the whole array.

// add element to the array
friends[2] = "Jay";
console.log(friends);
friends = ["Bob", "Alice"]; // ❌ cannot do this

const firstName = "Jonas";
const jonas = [firstName, "Schmedtmann", 2037 - 1991, "teacher", friends];
console.log(jonas);
console.log(jonas.length);

// Exercise
const calcAge = function (birthYear) {
  return 2037 - birthYear;
};
const years = [1990, 1967, 2002, 2010, 2018];

// to use calcAge function and then store the results of calculating the ages for some of these years into a new Array.
const age1 = calcAge(years[0]);
const age2 = calcAge(years[1]);
const age3 = calcAge(years[years.length - 1]);
console.log(age1, age2, age3);

// we can place function calls into an Array just fine, because they will produce a value
const ages = [
  calcAge(years[0]),
  calcAge(years[1]),
  calcAge(years[years.length - 1]),
];
console.log(ages);

// video - 41: Coding Challenge #2

/*
Steven is still building his tip calculator, using the same rules as before: Tip 15% of the bill if the bill value is between 50 and 300, and if the value is different, the tip is 20%.

1. Write a function 'calcTip' that takes any bill value as an input and returns the corresponding tip, calculated based on the rules above (you can check out the code from first tip calculator challenge if you need to). Use the function type you like the most. Test the function using a bill value of 100.
2. And now let's use arrays! So create an array 'bills' containing the test data below.
3. Create an array 'tips' containing the tip value for each bill, calculated from the function you created before.
4. BONUS: Create an array 'total' containing the total values, so the bill + tip.

TEST DATA: 125, 555 and 44

HINT: Remember that an array needs a value in each position, and that value can actually be the returned value of a function! So you can just call a function as array values (so don't store the tip values in separate variables first, but right in the new array) 😉

GOOD LUCK 😀
*/

const calcTip = function (bill) {
  return bill >= 50 && bill <= 300 ? bill * 0.15 : bill * 0.2;
};
// const calcTip = bill => bill >= 50 && bill <= 300 ? bill * 0.15 : bill * 0.2;

const bills = [125, 555, 44];
const tips = [calcTip(bills[0]), calcTip(bills[1]), calcTip(bills[2])];
const totals = [bills[0] + tips[0], bills[1] + tips[1], bills[2] + tips[2]];

console.log(bills, tips, totals);

// vid - 45: Coding Challenge #3

/*
Let's go back to Mark and John comparing their BMIs! This time, let's use objects to implement the calculations! Remember: BMI = mass / height ** 2 = mass / (height * height). (mass in kg and height in meter)

1. For each of them, create an object with properties for their full name, mass, and height (Mark Miller and John Smith)
2. Create a 'calcBMI' method on each object to calculate the BMI (the same method on both objects). Store the BMI value to a property, and also return it from the method.
3. Log to the console who has the higher BMI, together with the full name and the respective BMI. Example: "John Smith's BMI (28.3) is higher than Mark Miller's (23.9)!"

TEST DATA: Marks weights 78 kg and is 1.69 m tall. John weights 92 kg and is 1.95 m tall.

GOOD LUCK 😀
*/

const mark = {
  fullName: "Mark Miller",
  mass: 78,
  height: 1.69,
  calcBMI: function () {
    this.bmi = this.mass / this.height ** 2;
    return this.bmi;
  },
};

const john = {
  fullName: "John Smith",
  mass: 92,
  height: 1.95,
  calcBMI: function () {
    this.bmi = this.mass / this.height ** 2;
    return this.bmi;
  },
};

mark.calcBMI();
john.calcBMI();

console.log(mark.bmi, john.bmi);

// "John Smith's BMI (28.3) is higher than Mark Miller's (23.9)!"

if (mark.bmi > john.bmi) {
  console.log(
    `${mark.fullName}'s BMI (${mark.bmi}) is higher than ${john.fullName}'s BMI (${john.bmi})`
  );
} else if (john.bmi > mark.bmi) {
  console.log(
    `${john.fullName}'s BMI (${john.bmi}) is higher than ${mark.fullName}'s BMI (${mark.bmi})`
  );
}

// vid - 50: Coding Challenge #4

/*
Let's improve Steven's tip calculator even more, this time using loops!

1. Create an array 'bills' containing all 10 test bill values
2. Create empty arrays for the tips and the totals ('tips' and 'totals')
3. Use the 'calcTip' function we wrote before (no need to repeat) to calculate tips and total values (bill + tip) for every bill value in the bills array. Use a for loop to perform the 10 calculations!

TEST DATA: 22, 295, 176, 440, 37, 105, 10, 1100, 86 and 52

HINT: Call calcTip in the loop and use the push method to add values to the tips and totals arrays 😉

4. BONUS: Write a function 'calcAverage' which takes an array called 'arr' as an argument. This function calculates the average of all numbers in the given array. This is a DIFFICULT challenge (we haven't done this before)! Here is how to solve it:
  4.1. First, you will need to add up all values in the array. To do the addition, start by creating a variable 'sum' that starts at 0. Then loop over the array using a for loop. In each iteration, add the current value to the 'sum' variable. This way, by the end of the loop, you have all values added together
  4.2. To calculate the average, divide the sum you calculated before by the length of the array (because that's the number of elements)
  4.3. Call the function with the 'totals' array

GOOD LUCK 😀
*/

const calcTip = function (bill) {
  return bill >= 50 && bill <= 300 ? bill * 0.15 : bill * 0.2;
};
const bills = [22, 295, 176, 440, 37, 105, 10, 1100, 86, 52];
const tips = [];
const totals = [];

for (let i = 0; i < bills.length; i++) {
  const tip = calcTip(bills[i]); // for each loop bills and tip will have new value.
  tips.push(tip);
  totals.push(tip + bills[i]);
}
console.log(bills, tips, totals);

const calcAverage = function (arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    // sum = sum + arr[i];
    sum += arr[i];
  }
  return sum / arr.length;
};
console.log(calcAverage([2, 3, 7]));
console.log(calcAverage(totals));
console.log(calcAverage(tips));

// ----------   vid - 59: Using Google, StackOverflow and MDN

// PROBLEM 1:
// We work for a company building a smart home thermometer. Our most recent task is this: "Given an array of temperatures of one day, calculate the temperature amplitude. Keep in mind that sometimes there might be a sensor error."

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

const temperatures = [3, -2, -6, -1, "error", 9, 13, 17, 15, 14, 9, 5];

const calcTempAmplitude = function (temps) {
  let max = temps[0]; //  we start comparing from 0 index element cause we assume the first element of the array is the maximum value.
  let min = temps[0]; //  we start comparing from 0 index element cause we assume the first element of the array is the minimum value.

  for (let i = 0; i < temps.length; i++) {
    const curTemp = temps[i];
    if (typeof curTemp !== "number") continue; // if the  loops reaches (error) element then it will ignore and continue to the next number cause its not a number. and none of the condition will apply for this (error).

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min; // return the amplitude
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
    if (typeof curTemp !== "number") continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;
  }
  console.log(max, min);
  return max - min;
};
const amplitudeNew = calcTempAmplitudeNew([3, 5, 1], [9, 0, 5]);
console.log(amplitudeNew);

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
  let str = ""; // in each iteration we will simply add to that string current value of the array.
  for (let i = 0; i < arr.length; i++) {
    str += `${arr[i]}ºC in ${i + 1} days ... `; // (string = string + arr[i] => current value of the array of current position, for temperature)  & (i + 1 => current position of the array + 1 (0+1, 1+1, 2+1), for days)
  }
  console.log("..." + str);
};
printForecast(data1);

// ------------------------------------------------------

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
  let str = ""; // in each iteration we will simply add to that string current value of the array.
  for (let i = 0; i < arr.length; i++) {
    str += `${arr[i]}ºC in ${i + 1} days ... `; // (string = string + arr[i] => current value of the array of current position, for temperature)  & (i + 1 => current position of the array + 1 (0+1, 1+1, 2+1), for days)
  }
  console.log("..." + str);
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

// Drafted using common development resources
// Function to analyze a week's work hours
function analyzeWorkWeek(dailyHours) {
  // Define an array to map indexes to weekdays (assuming Monday is index 0)
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Validate that the input is an array of exactly 7 elements (one for each day of the week)
  // !Array.isArray(dailyHours) is used to check if dailyHours is not an array.
  // This condition checks whether the input array does not contain exactly 7 elements (one for each day of the week).   If dailyHours.length is not 7, the condition becomes true, and an error is thrown.
  if (!Array.isArray(dailyHours) || dailyHours.length !== 7) {
    throw new Error("Input must be an array of exactly 7 daily work hours.");
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
  const daysWorked = dailyHours.filter((hours) => hours > 0).length;

  // Check if the total hours worked is 35 or more (full-time threshold)
  // This comparison operator (>=) checks if totalHours is greater than or equal to 35.
  // If totalHours is 35 or more, the result is true (full-time).
  // Otherwise, it returns false (not full-time).
  const isFullTime = totalHours >= 35;

  // Return an object containing all the calculated results
  return {
    totalHours, // Total hours worked in the week : 34
    averageHours, // Average daily hours, rounded to one decimal place : 4.9
    maxDay, // The name of the day with the most hours worked : "Friday"
    daysWorked, // Number of days worked : 5
    isFullTime, // Boolean indicating if it was a full-time week : false
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
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (!Array.isArray(dailyHours) || dailyHours.length !== 7) {
    throw new Error("Input must be an array of exactly 7 daily work hours.");
  }
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const averageHours = Math.round((totalHours / dailyHours.length) * 10) / 10;
  const maxHours = Math.max(...dailyHours);

  const maxDayIndex = dailyHours.indexOf(maxHours);

  const maxDay = daysOfWeek[maxDayIndex];
  const daysWorked = dailyHours.filter((hours) => hours > 0).length;

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
