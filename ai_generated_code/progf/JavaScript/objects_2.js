/* Task 1
Create a JavaScript object named `library` that represents a collection of books.
Each book should have properties for `title`, `author`, and `yearPublished`. 
Add at least two book objects to this collection.
*/

// Your code here

function Book(title, author, yearPublished, genres) {
  this.title = title;
  this.author = author;
  this.yearPublished = yearPublished;
  this.genres = genres;
}

const book1 = new Book("The Catcher in the Rye", "J.D. Salinger", 1951);
const book2 = new Book("Pride and Prejudice", "Jane Austen", 1813);
const book3 = new Book("The Lord of the Rings", "J.R.R. Tolkien", 1954);
//Aided using common development resources

const library = [book1, book2, book3];

/* Task 2
Access the `title` of the first book in the `library` collection and log it to the console.
Modify the `yearPublished` for the second book in the collection to a new year, then log the updated book object to the console.
*/

// Your code here

// console.log(library[0].title);
library[1].yearPublished = 1814;
// console.log(library[1]);

/* Task 3
Use dot notation to add a new property `genres` (an array of strings) to the first book in the `library`.
Use bracket notation to add a boolean property `isAvailable` to the same book, indicating its availability.
*/

// Your code here

library[0].genres = ["Literary Fiction", "Coming-of-Age", "Bildungsroman"];
library[0]["isAvailable"] = true;
// console.log(library[0]);

/* Task 4
Define a constructor function named `Book` that can create new book objects with properties for `title`, `author`, `yearPublished`, and `genres`.
Using the `Book` constructor, create a new book object with the provided input values and add it to the `library` collection.
*/

// Your code here
const book4 = new Book("Frankenstein", "Mary Shelley", 1818, [
  "Gothic Fiction",
  "Science Fiction",
  "Horror",
]);
library.push(book4);
// console.log(library);

/* Task 5
Write a function named `createBook` that takes parameters for `title`, `author`, `yearPublished`, and `genres` (an array).
The function should return a new book object with these properties.
Test `createBook` by creating a new book object with user-provided input and logging the new book object to the console.
*/

// Your code here
const createBook = (title, author, yearPublished, genres) => {
  return new Book(title, author, yearPublished, genres);
};

createBook("Angels and Demons", "Dan Brown");
createBook("Origin", "Dan Brown");
createBook("Digital Fortress", "Dan Brown");
createBook("Da Vinchi Code", "Dan Brown");
// console.log(createBook("a", "b", "c", ["d", "e", "f"]));

/* Task 6
Convert the `library` collection to a JSON string and log it to the console.
Parse the JSON string back into a JavaScript object and log the first book's title to the console.
*/

const jsonLibrary = JSON.stringify(library);
// console.log(jsonLibrary);
const jsonLibraryBackToJS = JSON.parse(jsonLibrary);
// console.log(jsonLibraryBackToJS);

// const jsonLibrary2 = jsonLibrary.json();
// console.log(jsonLibrary2);
// only work when taking a response to return a promise. In simpler case just use stringify and parse
