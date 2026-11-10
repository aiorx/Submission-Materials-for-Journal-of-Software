// https://adventofcode.com/2024/day/7

import { parseLines } from '../../utils/helpers'
import { type BinaryOperation, add, concat, mult } from '../../utils/number'

const operators = ['+', '*', '||'] as const
type Operator = (typeof operators)[number]

type Equation = {
  readonly answer: number
  readonly numbers: number[]
}

const operatorMap: Record<Operator, BinaryOperation> = {
  '+': add,
  '*': mult,
  '||': concat
}

const parseEquation = (line: string): Equation => {
  const [answer, ...numbers] = line.split(/[:\s]+/g).map(Number)
  return { answer, numbers }
}

/**
 * thanks chatgpt 😓
 */
const cartesianProduct = <T>(arr: T[], size: number) => {
  if (size <= 1) {
    return arr.map(x => [x])
  }

  const result: T[][] = []
  const next = cartesianProduct(arr, size - 1)

  arr.forEach(x => {
    next.forEach(n => {
      result.push([x, ...n])
    })
  })
  return result
}

const calculateEquation = (
  numbers: number[],
  operatorStr: Operator[]
): number => {
  const operations = operatorStr.map(o => operatorMap[o])

  return numbers.reduce((acc, n, i) => {
    if (i === 0) {
      return n
    }
    const op = operations[i - 1]
    return op(acc, n)
  }, 0)
}

const findValidEquations = (equations: Equation[], operators: Operator[]) => {
  return equations.reduce((sum, { answer, numbers }) => {
    const operatorCombos = cartesianProduct(operators, numbers.length - 1)
    const isValidEquation = operatorCombos.some(
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
export const part1 = (input: string) => {
  const lines = parseLines(input)
  const equations = lines.map(parseEquation)
  const operators: Operator[] = ['+', '*']

  return findValidEquations(equations, operators)
}

/**
 * Part 2:
 * Part 1 but with another operator || that concats two numbers together
 */
export const part2 = (input: string) => {
  const lines = parseLines(input)
  const equations = lines.map(parseEquation)
  const operators: Operator[] = ['+', '*', '||']

  return findValidEquations(equations, operators)
}
