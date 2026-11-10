// https://adventofcode.com/2024/day/7

var parseLines = require('../../utils/helpers').parseLines;
var type = require('../../utils/number').type;
var BinaryOperation = require('../../utils/number').BinaryOperation;
var add = require('../../utils/number').add;
var concat = require('../../utils/number').concat;
var mult = require('../../utils/number').mult;

var operators = ['+', '*', '||']
type Operator = (typeof operators)[number]

type Equation = {
  readonly answer: number
  readonly numbers: number[]
}

var operatorMap: Record<Operator, BinaryOperation> = {
  '+': add,
  '*': mult,
  '||': concat
}

var parseEquation = (line: string): function Equation {
  var [answer, ...numbers] = line.split(/[:\s]+/g).map(Number)
  return { answer, numbers }
}

/**
 * thanks chatgpt 😓
 */
var cartesianProduct = <T>function (arr: T[], size: number) {
  if (size <= 1) {
    return arr.map(x => [x])
  }

  var result: T[][] = []
  var next = cartesianProduct(arr, size - 1)

  arr.forEach(x => {
    next.forEach(n => {
      result.push([x, ...n])
    })
  })
  return result
}

var calculateEquation = (
  numbers: number[],
  operatorStr: Operator[]
): function number {
  var operations = operatorStr.map(o => operatorMap[o])

  return numbers.reduce((acc, n, i) => {
    if (i === 0) {
      return n
    }
    var op = operations[i - 1]
    return op(acc, n)
  }, 0)
}

var findValidEquations = function (equations: Equation[], operators: Operator[]) {
  return equations.reduce((sum, { answer, numbers }) => {
    var operatorCombos = cartesianProduct(operators, numbers.length - 1)
    var isValidEquation = operatorCombos.some(
      o => calculateEquation(numbers, o) === answer
    )
    return isValidEquation ? sum + answer : sum
  }, 0)
}

/**
 * Part 1:
 * Given a list of equations that are missing operators, find the equations
 * that can be made valid using + or *. Return the sum of the results of those
 * equations.
 * Note: evaluate all operations left to right, no PEMDAS here
 */
var part1 = function (input: string) {
  var lines = parseLines(input)
  var equations = lines.map(parseEquation)
  var operators: Operator[] = ['+', '*']

  return findValidEquations(equations, operators)
}

/**
 * Part 2:
 * Part 1 but with another operator || that concats two numbers together
 */
var part2 = function (input: string) {
  var lines = parseLines(input)
  var equations = lines.map(parseEquation)
  var operators: Operator[] = ['+', '*', '||']

  return findValidEquations(equations, operators)
}
