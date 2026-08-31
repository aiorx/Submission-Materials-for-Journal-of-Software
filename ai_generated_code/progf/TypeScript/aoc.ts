// GLOBALS
const operations = [
    (n1: number, n2: number) => n1 * n2,
    (n1: number, n2: number) => n1 + n2
];

type Equation = {
    result: number,
    operands: number[]
};

function parse(input: string): Equation[] {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re) || [];
        const numbers = matches.map(sm => parseInt(sm));
        return numbers;
    };

    const toEquations = (numbers: number[]): Equation => {
        const equation: Equation = {
            result: numbers.shift() || 0,
            operands: numbers
        };
        return equation;
    }

    return input
        .split('\n')
        .map(toNumberArray)
        .map(toEquations);
};

function testPermutations(equation: Equation, index: number, equations): boolean {
    //console.log(`${index+1} / ${equations.length}`);
    return generatePermutations(equation.operands.length - 1)
        .some(symbols => evaluateEquation(equation, symbols));
}

// Aided with basic GitHub coding tools
function generatePermutations(numberOfSymbols: number): number[][] {
    const result: number[][] = [];

    const backtrack = (current: number[]) => {
        if (current.length === numberOfSymbols) {
            result.push([...current]);
            return;
        }

        for (let i = 0; i <= operations.length - 1; i++) {
            current.push(i);
            backtrack(current);
            current.pop();
        }
    };

    backtrack([]);
    //console.log(result.length);
    return result;
}

function evaluateEquation(equation: Equation, symbols: number[]): boolean {
    let result = equation.operands[0];

    for (let i = 1; i < equation.operands.length; i++) {
        if (result > equation.result) return false;
        const operand = equation.operands[i];
        const symbol = symbols[i - 1];
        result = operations[symbol](result, operand);
    }
    return result === equation.result;
}

export const part1 = async (input: string): Promise<number | string> => {
    const equations = parse(input);
    const solution = equations
        .map(testPermutations)
        .reduce((sum, isValid, index) => {
            return isValid ? sum + equations[index].result : sum;
        }, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    // Add a new operation ||
    if (operations.length === 2) { // We have to check the length because operations is a global variable.
        operations.push((n1: number, n2: number) => parseInt(`${n1}${n2}`));
    }

    const equations = parse(input);
    const solution = equations
        .map(testPermutations)
        .reduce((sum, isValid, index) => {
            return isValid ? sum + equations[index].result : sum;
        }, 0);
    return solution;
};
