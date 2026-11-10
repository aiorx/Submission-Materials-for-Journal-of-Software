// Initial code is has been Aided using common development resources 3.5

var Animal = require('./OOP/2.Inheritance-improved').Animal;
var Dog = require('./OOP/2.Inheritance-improved').Dog;
var Cat = require('./OOP/2.Inheritance-improved').Cat;

type ValidationResult = {
  isValid: boolean;
  messages: string[];
};

function validateOOPCompliance(classes: Function[]): ValidationResult {
  var messages: string[] = [];

  classes.forEach(function (clazz) {
    if (typeof clazz !== 'function') {
      messages.push("Invalid class: " + (clazz) + " is not a constructor function.");
    }

    // Add more checks as needed for OOP principles

    // Example: Check if the class has a constructor
    if (!clazz.prototype.hasOwnProperty('constructor')) {
      messages.push("Invalid class: " + (clazz.name) + " is missing a constructor.");
    }
  });

  return {
    isValid: messages.length === 0,
    messages,
  };
}

function validateSOLIDCompliance(classes: Function[]): ValidationResult {
  // Implement SOLID checks
  // Example: Check if each class follows Single Responsibility Principle
  var messages: string[] = [];

  classes.forEach(function (clazz) {
    // Implement checks as needed for SOLID principles
  });

  return {
    isValid: messages.length === 0,
    messages,
  };
}

function validateGRASPCompliance(classes: Function[]): ValidationResult {
  // Implement GRASP checks
  // Example: Check if each class has an "information expert" for certain responsibilities
  var messages: string[] = [];

  classes.forEach(function (clazz) {
    // Implement checks as needed for GRASP principles
  });

  return {
    isValid: messages.length === 0,
    messages,
  };
}

// Example usage:

var classesToValidate: Function[] = [Animal, Dog, Cat];
var oopValidation = validateOOPCompliance(classesToValidate);
var solidValidation = validateSOLIDCompliance(classesToValidate);
var graspValidation = validateGRASPCompliance(classesToValidate);

console.log('OOP Validation:', oopValidation);
console.log('SOLID Validation:', solidValidation);
console.log('GRASP Validation:', graspValidation);

// Buddy: Woof! Woof!
// Barsik: Meow! Meow!
// OOP Validation: { isValid: true, messages: [] }
// SOLID Validation: { isValid: true, messages: [] }
// GRASP Validation: { isValid: true, messages: [] }
