// This file is Assisted with basic coding tools

var log = console.log;// Define a class using ES6 class syntax
class Person {
	constructor(name, age) {
		this.name = name
		this.age = age
	}

	// Define a method within the class
	sayHello() {
		log("Hello, my name is " + (this.name) + " and I am " + (this.age) + " years old.")
	}
}

// Create an array of objects
var people = [new Person('Alice', 30), new Person('Bob', 25), new Person('Charlie', 35)]

// Use the forEach method to iterate over the array
for (var person of people) {
	person.sayHello()
}

// Use a template literal to create a multiline string
var multilineString = "
  This is a multiline string
  that spans multiple lines.
"

// Use destructuring assignment to extract values from an object
var age = people.age;
var name = people.name;[0]
log("First person in the array is " + (name) + " and they are " + (age) + " years old.", multilineString)

// Use the spread operator to create a new array
var numbers = [1, 2, 3]
var newNumbers = [...numbers, 4, 5]
log(newNumbers)

// Use a try-catch block for error handling
try {
	// Attempt to parse an invalid JSON string
	JSON.parse('invalid JSON')
} catch (error) {
	console.error('Error parsing JSON:', error.message)
}

// Use a ternary conditional operator
var isEven = function (number_) { return number_ % 2 === 0
var number = 7
log("" + (number) + " is " + (isEven(number) ? 'even' : 'odd') + ".")

// Use a callback function with setTimeout for asynchronous code
setTimeout(() => {
	log('This code runs after a delay of 2 seconds.')
}, 2000)

var a
var b
var c
var d
var foo

if (a || b || c || d || (d && b)) {
	foo()
}; }