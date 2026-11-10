var PluginObj = require('@babel/core').PluginObj;
var getStableKey = require('./stableString').getStableKey;
var getStableValue = require('./stableString').getStableValue;
import {
  hasStringLiteralArguments,
  hasStringLiteralJSXAttribute,
  isSvgElementAttribute
} from "./visitorChecks";
var NodePath = require('ast-types').NodePath;
var JSXElement = require('ast-types/gen/nodes').JSXElement;
var jsx = require('ast-types/def/jsx');

let keyMaxLength = 40;
let phrases: string[] = [];
let i18nMap = {};

const addPhrase = function (displayText: string, keyText?: string) {
  const key = getStableKey(keyText ? keyText: displayText, keyMaxLength);
  const value = getStableValue(displayText);

  if (!key || !value) {
    return null;
  }

  i18nMap[key] = value;
  phrases = [
    ...phrases,
    value,
  ];

  return { key, value };
};

function BabelPluginI18n(): PluginObj {
  return {
    name: 'i18n',
    visitor: {
      JSXAttribute(path) {
        var node = path.node;

        if (hasStringLiteralJSXAttribute(path) && !isSvgElementAttribute(path)) {
          addPhrase(node.value.value);
        }
      },
      JSXElement(path) {
        var node = path.node;
        const jsxContentNodes =  node.children;
        extractArguments(jsxContentNodes)
          .forEach(function ({textWithArgs, textWithoutArgs}) { return addPhrase(textWithArgs, textWithoutArgs); });

      },
      JSXExpressionContainer(path) {
        var node = path.node;

        if (node.expression.type === 'StringLiteral') {
          addPhrase(path.node.expression.value);
        } else if (node.expression.type === 'ConditionalExpression') {
          let expression = path.node.expression;
          if (expression.consequent.type === 'StringLiteral') {
            addPhrase(expression.consequent.value)
          }
          if (expression.alternate.type === 'StringLiteral') {
            addPhrase(expression.alternate.value);
          }
        }
      },
      CallExpression(path) {
        if (hasStringLiteralArguments(path)) {
          for (const arg of path.node.arguments) {
            if (arg.type === 'StringLiteral') {
              addPhrase(arg.value)
            }

            if (arg.type === 'ObjectExpression') {
              if (arg.properties.length === 0) {
                continue;
              }

              for (const prop of arg.properties) {
                if (prop.value && prop.value.type === 'StringLiteral') {
                  addPhrase(prop.value.value);
                }
              }
            }
          }
        }
      }
    }
  }
}

function extractArguments(jsxContentNodes: NodePath<any>[]) {
  let textWithArgs = '';
  let textWithoutArgs = '';
  let argIndex = 0;
  let hasText = false;
  const texts = [];
  for(let i = 0; i < jsxContentNodes.length; i++) {
    const element = jsxContentNodes[i];
    if (element.type === 'JSXText') {
      hasText = true;
      textWithArgs += element.value;
      textWithoutArgs += element.value;
    } else if (element.type === 'JSXExpressionContainer') {
      textWithArgs += "{arg" + (argIndex) + "}";
      argIndex++;
    } else {
      if (hasText) {
        texts.push({ textWithArgs, textWithoutArgs });
        textWithArgs = '';
        textWithoutArgs = ''
      }
    }
  }
  if (hasText) {
    texts.push({ textWithArgs, textWithoutArgs });
  }
  return texts;
}

BabelPluginI18n.clear = function () {
  phrases = [];
  i18nMap = {};
};
BabelPluginI18n.setMaxKeyLength = function (maxLength: number) {
  keyMaxLength = maxLength;
};
BabelPluginI18n.getExtractedStrings = function () { return phrases; };
BabelPluginI18n.getI18Map = function () { return i18nMap; };

module.exports = BabelPluginI18n;
