"use strict";
// Ritchest customer wealth
// You are given an m x n integer grid accounts where accounts[i][j] is the amount of money the i​​​​​​​​​​​th​​​​ customer has in the j​​​​​​​​​​​th​​​​ bank. Return the wealth that the richest customer has.
// A customer's wealth is the amount of money they have in all their bank accounts. The richest customer is the customer that has the maximum wealth.
// Eample 1:Input: accounts = [[1,2,3],[3,2,1]]
// Output: 6
// Explanation:
// 1st customer has wealth = 1 + 2 + 3 = 6
// 2nd customer has wealth = 3 + 2 + 1 = 6
// Both customers are considered the richest with a wealth of 6 each, so return 6.
// code by me
const numCount = Number(prompt("Enter the number of accounts you want to input:"));
const numValue = Number(prompt("Enter the numbers of value of each account: "));
let sum = 0;
for (let a = 1; a <= numCount; a++) {
    const accounts = [];
    for (let i = 0; i < numValue; i++) {
        const userInput = prompt(`Enter integer ${i + 1}:`, ' Acoount ' + a);
        const parsedInt = parseInt(userInput, 10); // Convert input to an integer
        if (!isNaN(parsedInt)) {
            accounts.push(parsedInt); // Add the integer to the array
        }
        else {
            console.log(`Invalid input: "${userInput}" is not a valid integer.`);
        }
    }
    console.log("Array of account", a, accounts);
    sum = accounts.reduce((total, current) => total + current, 0);
    console.log(sum);
}
// code Produced via common programming aids with siolyfication in my code
function getAccountSum(numCount, numValue) {
    let totalSum = 0;
    for (let a = 1; a <= numCount; a++) {
        const accounts = [];
        for (let i = 0; i < numValue; i++) {
            const userInput = prompt(`Enter integer ${i + 1}:`, 'Account ' + a);
            const parsedInt = parseInt(userInput, 10); // Convert input to an integer
            if (!isNaN(parsedInt)) {
                accounts.push(parsedInt); // Add the integer to the array
            }
            else {
                console.log(`Invalid input: "${userInput}" is not a valid integer.`);
            }
        }
        console.log("Array of account", a, accounts);
        const accountSum = accounts.reduce((total, current) => total + current, 0);
        totalSum += accountSum; // Update the total sum with the sum of the current accounts
    }
    return totalSum;
}
const numCount1 = Number(prompt("Enter the number of accounts : "));
const numValue1 = Number(prompt("Enter the number of values for each account : "));
const totalSum1 = getAccountSum(numCount1, numValue1);
const numCount2 = Number(prompt("Enter the number of accounts :"));
const numValue2 = Number(prompt("Enter the number of values for each account :"));
const totalSum2 = getAccountSum(numCount2, numValue2);
console.log("Total sum for the first set:", totalSum1);
console.log("Total sum for the second set:", totalSum2);
if (totalSum1 > totalSum2) {
    console.log("The total sum for the first set of accounts is greater.");
}
else if (totalSum1 < totalSum2) {
    console.log("The total sum for the second set of accounts is greater.");
}
else {
    console.log("The total sums for both sets of accounts are equal.");
}
