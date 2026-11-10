// GLOBALS
var operations = [
    function (n1: number, n2: number) { return n1 * n2; },
    function (n1: number, n2: number) { return n1 + n2; }];

type Equation = {
    result: number,
    operands: number[]
};

function parse(input: string): Equation[] {
    var toNumberArray = (s: string): number[] => {
        var re: RegExp = /(-?\d+)/g;
        var matches = s.match(re) || [];
        var numbers = matches.map(function sm { return parseInt(sm); });
        return numbers;
    };

    var toEquations = (numbers: number[]): function Equation {
        var equation: Equation = {
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
        .some(function symbols { return evaluateEquation(equation, symbols); });
}

// Aided with basic GitHub coding tools
function generatePermutations(numberOfSymbols: number): number[][] {
    var result: number[][] = [];

    var backtrack = function (current: number[]) {
        if (current.length === numberOfSymbols) {
            result.push([...current]);
            return;
        }

        for (var i = 0; i <= operations.length - 1; i++) {
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
    var result = equation.operands[0];

    for (var i = 1; i < equation.operands.length; i++) {
        if (result > equation.result) return false;
        var operand = equation.operands[i];
        var symbol = symbols[i - 1];
        result = operations[symbol](result, operand);
    }
    return result === equation.result;
}

var part1 = async (input: string): Promise<number | string> => {
    var equations = parse(input);
    var solution = equations
        .map(testPermutations)
        .reduce(function (sum, isValid, index) {
            return isValid ? sum + equations[index].result : sum;
        }, 0);
    return solution;
};

var part2 = async (input: string): Promise<number | string> => {
    // Add a new operation ||
    if (operations.length === 2) { // We have to check the length because operations is a global variable.
        operations.push(function (n1: number, n2: number) { return parseInt("" + (n1) + "" + (n2) + ""); });
    }

    var equations = parse(input);
    var solution = equations
        .map(testPermutations)
        .reduce(function (sum, isValid, index) {
            return isValid ? sum + equations[index].result : sum;
        }, 0);
    return solution;
};
