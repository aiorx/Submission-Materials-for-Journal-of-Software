//! Aided using common development resources
// PART 1
var fs = require('fs');

// Read the file and parse its contents as a list of rucksacks
var rucksacks = fs
    .readFileSync('input3.txt', 'utf8')
    .split('\n')
    .filter(function line { return line !== ''; });

// Sum of priorities of item types that appear in both compartments of each rucksack
var totalPriority = 0;

// Iterate through the list of rucksacks
for (var rucksack of rucksacks) {
    // Find the first half of the rucksack's items (first compartment)
    var firstHalf = rucksack.slice(0, rucksack.length / 2);
    // Find the second half of the rucksack's items (second compartment)
    var secondHalf = rucksack.slice(rucksack.length / 2);

    // Find the item type that appears in both compartments
    var commonItemType = null;
    for (var itemType of firstHalf) {
        if (secondHalf.includes(itemType)) {
            commonItemType = itemType;
            break;
        }
    }

    // Determine the priority of the common item type
    var priority = 0;
    if (commonItemType.toLowerCase() === commonItemType) {
        // Lowercase item types have priorities 1 through 26
        priority = commonItemType.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else if (commonItemType.toUpperCase() === commonItemType) {
        // Uppercase item types have priorities 27 through 52
        priority = commonItemType.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }

    // Add the priority to the total sum
    totalPriority += priority;
}

// Print the final result
console.log(totalPriority);

//PART 2

// Sum of priorities of item types that correspond to the badges of each group of three Elves
totalPriority = 0;

// Iterate through the list of rucksacks in groups of three
for (var i = 0; i < rucksacks.length; i += 3) {
    // Get the current group of three rucksacks
    var group = rucksacks.slice(i, i + 3);

    // Find the item type that appears in all three rucksacks
    var commonItemType = null;
    for (var itemType of group[0]) {
        if (group[1].includes(itemType) && group[2].includes(itemType)) {
            commonItemType = itemType;
            break;
        }
    }

    // Determine the priority of the common item type
    var priority = 0;
    if (commonItemType.toLowerCase() === commonItemType) {
        // Lowercase item types have priorities 1 through 26
        priority = commonItemType.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    } else if (commonItemType.toUpperCase() === commonItemType) {
        // Uppercase item types have priorities 27 through 52
        priority = commonItemType.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
    }

    // Add the priority to the total sum
    totalPriority += priority;
}

// Print the final result
console.log(totalPriority);