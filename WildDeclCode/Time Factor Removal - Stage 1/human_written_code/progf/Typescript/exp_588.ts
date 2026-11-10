var Node = require('../../Node').Node;
var ESTree = require('../../Node').ESTree;
var BaseClosure = require('../../Closure').BaseClosure;
var Messages = require('../../Message').Messages;
var Interpreter = require('../../../interpreter/main').Interpreter;

// a==b a/b
function binaryExpressionHandler(this:Interpreter, node: ESTree.BinaryExpression): BaseClosure {
    const leftExpression = this.createClosure(node.left);
    const rightExpression = this.createClosure(node.right);

    return function () {
        const leftValue = leftExpression();
        const rightValue = rightExpression();

        switch (node.operator) {
            case "==":
                return leftValue == rightValue;
            case "!=":
                return leftValue != rightValue;
            case "===":
                return leftValue === rightValue;
            case "!==":
                return leftValue !== rightValue;
            case "<":
                return leftValue < rightValue;
            case "<=":
                return leftValue <= rightValue;
            case ">":
                return leftValue > rightValue;
            case ">=":
                return leftValue >= rightValue;
            case "<<":
                return leftValue << rightValue;
            case ">>":
                return leftValue >> rightValue;
            case ">>>":
                return leftValue >>> rightValue;
            case "+":
                return leftValue + rightValue;
            case "-":
                return leftValue - rightValue;
            case "*":
                return leftValue * rightValue;
            case "**":
                return Math.pow(leftValue, rightValue);
            case "/":
                return leftValue / rightValue;
            case "%":
                return leftValue % rightValue;
            case "|":
                return leftValue | rightValue;
            case "^":
                return leftValue ^ rightValue;
            case "&":
                return leftValue & rightValue;
            case "in":
                return leftValue in rightValue;
            case "instanceof":
                return leftValue instanceof rightValue;
            default:
                throw this.createInternalThrowError(
                    Messages.BinaryOperatorSyntaxError,
                    node.operator,
                    node
                );
        }
    };
}