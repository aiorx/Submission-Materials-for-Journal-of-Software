// Chapter 4. Data Structures: Objects and Arrays
// This chapter has a good section on some data science methods
let listOfNumbers = [2, 3, 5, 7, 11];

// Get length of array.
console.log(listOfNumbers.length); // -> 5

// These are the same
console.log(listOfNumbers.at(3)); // -> 7
console.log(listOfNumbers[0]); // -> 2

// Undefined results
console.log(listOfNumbers["11"]); // -> undefined
console.log(listOfNumbers[7]); // -> undefined



// Methods
let doh = "Doh";
console.log(typeof doh.toUpperCase); // -> function

console.log(doh.toUpperCase()); // -> DOH

let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence); // -> [1, 2, 3, 4, 5]
console.log(sequence.pop()); // -> 5
console.log(sequence); // -> [1, 2, 3, 4]


// Objects (arbitrary collections of properties) ((similar to python dicts))
let day1 = {
    squirrel: false,
    events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel) // -> false

// this property doesn't exist yet.
console.log(day1.wolf) // -> undefined

// add property
day1.wolf = false;
console.log(day1.wolf) // -> false


let journal = [
    {events: ["work", "touched tree", "pizza", "running", "television"],
    squirrel: false},
    {events: ["work", "ice cream", "cauliflower", "lasagna", "touched tree", "brushed teeth"],
    squirrel: false},
    {events: ["weekend", "cycling", "break", "peanuts", "beer"],
    squirrel: true},
]
console.log(journal[1].events)


// constant declared objects.
const score = {visitors: 0, home : 0};
// update properties like this:s
score.visitors = 1;
// score = {visitors: 1, home : 1}; // -> this will thrown an error



let myJournal = [];

function addEntry(events, squirrel) {
    myJournal.push({events, squirrel});
}

addEntry(["work", "touched tree"], false)
addEntry(["ran", "watched tv"], false)
addEntry(["slept", "touched tree", "coded"], false)

console.log(myJournal[0].events);


// IMPORTANT //
// Array for of Loop... (similar to pythons 'for n in myList' structures.)
for (let entry of myJournal) {
    console.log(`${entry.events.length} events.`);
}


// Further Arrayology
// When using .push and .pop on an array, it behaves like a stack. (LIFO)
// By using .shift and .unshift on an array, it behaves like a queue. (FIFO)

let todoList = [];
function remember(task) {
    // adds a task to the end of the queue.
    todoList.push(task);
}
function rememberUrgently(task) {
    // adds a task to the front of the queue.
    todoList.unshift(task);
}
function getTask() {
    // retrieves and removes the queue's front most task.
    return todoList.shift();
}

remember('groceries');
remember('game with the boys');
remember('feed taro');
remember('shower');
remember('run');
remember('pet taro');

console.log(todoList);
console.log(getTask()); // remembers groceries (thus removing it from the queue)
console.log(todoList);
console.log(rememberUrgently("get lit")) // adds "get lit" to front of queue.
console.log(todoList);


// searching for specific values.
// both methods technically take a second argument that indicates where to 
// start searching in the array.
myList = [1, 2, 3, 2 ,1]
// search from start to end
console.log(myList.indexOf(2)); // -> 1
// search from end to start
console.log(myList.lastIndexOf(2)); // -> 3

// Slices
console.log(myList.slice(2, 4)); // -> [3, 2]
console.log(myList.slice(2)); // -> [3, 2, 1]

// JSON
/* 
Objects and arrays are stored in the computer's memory as sequences of
bits holding the addresses of their contents. If you want to save data
in a file for later or send it to another computer over the network, you
have to convert these memory addresses to a description that can be stored
or sent. To do this, we serialize the data. JSON is a popular serialization
format. It is widely used as a data storage and communication format on
the web, even with languages other than JavaScript.

JSON looks similar to JavaScript's objects, but with a few restrictions.

-> All property names have to be surrounded by double quotes.
-> Only simple data expressions, no function calls or bindings.
-> No comments

we use the functions JSON.stringify() and JSON.parse() to convert data to and
from this format.
*/


// Exercises

// The Sum of a Range
function range(a, b, step = 1) {
    let array = [];
    if (step > 0){
        for (let i = a; i <= b; i = i + step) {
            array.push(i)
    }} else if (step < 0) {
        for (let i = a; i >= b; i = i + step) {
            array.push(i)
        }
    }
    return array
};

function sum(item) {
    summation = 0;
    for (n of item) {
        summation += n
    };
    return summation
};

console.log(range(1, 10));
console.log(sum(range(1, 10)));
console.log(range(5, 2, -1));


// Reversing an Array

function reverseArray(array) {
    let reversed = [];
    while (array.length > 0) {
        reversed.push(array.pop())
    }
    return reversed;
};
console.log(reverseArray(range(1,5)));


function reverseArrayInPlace(array) {
    let step = 0;
    let switchValue = 0;

    while (step < array.length - 1 - step) {
        switchValue = array[0 + step];
        array[0 + step] = array[array.length - 1 - step];
        array[array.length - 1 - step] = switchValue;
        step++;
    }
    return array;
};
console.log(reverseArrayInPlace(range(1, 6)));


// A List (linked list data structure)
//  ((This was Supported via standard GitHub programming aids. Study these two functions closely.))
function createNode (value, rest=null) {
    return {
        value: value,
        rest: rest
    };
}

function arrayToList(array) {
    if (array.length === 0) {
        return null;
    }

    let head = createNode(array[0])
    let currentNode = head;

    for (let i = 1; i < array.length; i++) {
        currentNode.rest = createNode(array[i]);
        currentNode = currentNode.rest;
    }
    return head;
}
let myArray = [1, 2, 3, 4, 5];
let linkedList = arrayToList(myArray);
console.log(linkedList)


// List to Array
//  ((This function I did write :D ))
function listToArray(list) {
    let arr = [];
    let currentNode = list;
    let i = 0;

    while (currentNode.rest != null){
        arr[i] = currentNode.value
        currentNode = currentNode.rest
        i++;
    }
    arr[i] = currentNode.value;
    return arr;
};
console.log(listToArray(linkedList));


// Deep Comparison ((come back to this one later))
function deepEqual (obj_1, obj_2) {

}