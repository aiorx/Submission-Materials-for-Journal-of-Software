//Produced using standard development resources and https://github.com/qa-gary-parker/mermaid-parse-playwright

import { readFileSync, writeFileSync } from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// Path to the Playwright test file
const testFile = 'tests/bugs.spec.ts'; // Update with your test file name if needed
const testCode = readFileSync(testFile, 'utf-8');

// Parse the test file into AST
const ast = parse(testCode, {
  sourceType: 'module',
  plugins: ['jsx'],
});

// Initialize a Mermaid diagram structure
let mermaidDiagram = `%%{init: {"themeVariables": {"fontSize": "16px", "nodeBorder": "1px solid #333", "nodeTextColor": "#333", "edgeColor": "#333", "nodeBackground": "#fff", "edgeLabelBackground": "#ffffff"} }}%%\n`;
mermaidDiagram += `flowchart TD\n`;

// Counter for nodes and steps
let stepCounter = 1;

// Map to track existing nodes (to avoid duplicates)
let nodeMap = {};

// Function to generate unique node keys for tracking
function generateNodeKey(action, value, extra = '') {
  return `${action}:${value}:${extra}`;
}

// Helper function to clean URLs (remove 'https://')
function cleanUrl(text) {
  return text.replace(/^https?:\/\//, '');
}

// Function to handle Playwright actions
function handlePlaywrightAction(action, args, lastNode) {
  let newNode = '';
  let nodeKey = '';
  // Handle 'goto' action (navigation)
  if (action === 'goto') {
    let url = args[0].value;
    // Remove 'https://' from the URL
    url = cleanUrl(url);
    nodeKey = generateNodeKey('goto', url);
    if (!nodeMap[nodeKey]) {
      newNode = `B${stepCounter}("fa:fa-globe Navigate to ${url}")`;
      mermaidDiagram += `        ${lastNode} --> ${newNode}\n`;
      nodeMap[nodeKey] = `B${stepCounter}`; // Store the node in the map
      stepCounter++;
    }
    lastNode = nodeMap[nodeKey]; // Reuse the existing node
  }
  // Handle 'click' action (clicking a selector)
  if (action === 'click') {
    const selector = args[0].value;
    nodeKey = generateNodeKey('click', selector);
    if (!nodeMap[nodeKey]) {
      newNode = `C${stepCounter}("fa:fa-mouse-pointer Click ${selector}")`;
      mermaidDiagram += `        ${lastNode} --> ${newNode}\n`;
      nodeMap[nodeKey] = `C${stepCounter}`; // Store the node in the map
      stepCounter++;
    }
    lastNode = nodeMap[nodeKey]; // Reuse the existing node
  }
  // Handle 'fill' action (filling a form field)
  if (action === 'fill') {
    const selector = args[0].value;
    const value = args[1].value;
    nodeKey = generateNodeKey('fill', selector, value); // Include value to track different inputs
    if (!nodeMap[nodeKey]) {
      newNode = `D${stepCounter}("fa:fa-keyboard Fill ${selector} with '${value}'")`;
      mermaidDiagram += `        ${lastNode} --> ${newNode}\n`;
      nodeMap[nodeKey] = `D${stepCounter}`; // Store the node in the map with the value
      stepCounter++;
    }
    lastNode = nodeMap[nodeKey]; // Reuse the existing node
  }
  return lastNode;
}

// Function to handle expect statements
function handleExpectStatement(args, lastNode) {
  let assertionDetail = '';
  if (args[0].type === 'MemberExpression') {
    assertionDetail = args[0].property.name;
  } else if (args[0].type === 'StringLiteral') {
    assertionDetail = cleanUrl(args[0].value);
  } else if (args[0].type === 'RegExpLiteral') {
    assertionDetail = `/${args[0].pattern}/${args[0].flags}`;
  }
  let newNode = `E${stepCounter}("fa:fa-check Expect: ${assertionDetail}")`;
  mermaidDiagram += `        ${lastNode} --> ${newNode}\n`;
  lastNode = newNode; // Update lastNode to the new assertion node
  stepCounter++;
  return lastNode;
}

// Traverse AST to handle multiple test cases
traverse(ast, {
  CallExpression(path) {
    const { callee, arguments: args } = path.node;
    // Identify test cases by matching `test()` call
    if (callee.type === 'Identifier' && callee.name === 'test') {
      const testName = args[0].value;
      // Updated check for @manual tag
      const isManual =
        args[1] &&
        args[1].type === 'ObjectExpression' &&
        args[1].properties.some(
          (prop) =>
            prop.key.name === 'tag' &&
            prop.value.value &&
            prop.value.value.includes('@manual'),
        );
      // Start a new subgraph for each test case
      const subgraphLabel = isManual ? `Manual test - ${testName}` : testName;
      mermaidDiagram += `    subgraph "${subgraphLabel}"\n`;
      // Reset lastNode for each test
      let lastNode = `T${stepCounter}("Test: ${testName}")`;
      mermaidDiagram += `        ${lastNode}\n`;
      stepCounter++;

      // Traverse the body of the test function
      path.traverse({
        CallExpression(innerPath) {
          const { callee: innerCallee, arguments: innerArgs } = innerPath.node;
          // Handle Playwright actions within the test cases
          if (innerCallee.type === 'MemberExpression') {
            const action = innerCallee.property.name;
            lastNode = handlePlaywrightAction(action, innerArgs, lastNode);
          }
          // Handle methods from Page Object Model
          if (
            innerCallee.type === 'MemberExpression' &&
            innerCallee.object.type === 'MemberExpression'
          ) {
            const pageObject = innerCallee.object.property.name;
            const method = innerCallee.property.name;
            const argsString = innerArgs.map((arg) => arg.value).join(', ');
            let newNode = `F${stepCounter}("fa:fa-cogs ${pageObject}.${method}(${argsString})")`;
            mermaidDiagram += `        ${lastNode} --> ${newNode}\n`;
            lastNode = `F${stepCounter}`; // Update lastNode to the new method node
            stepCounter++;

            // Traverse the body of the POM method to find Playwright actions
            innerPath.traverse({
              CallExpression(pomPath) {
                const { callee: pomCallee, arguments: pomArgs } = pomPath.node;
                if (pomCallee.type === 'MemberExpression') {
                  const pomAction = pomCallee.property.name;
                  lastNode = handlePlaywrightAction(
                    pomAction,
                    pomArgs,
                    lastNode,
                  );
                }
              },
            });
          }
          // Handle expect statements
          if (
            innerCallee.type === 'Identifier' &&
            innerCallee.name === 'expect'
          ) {
            lastNode = handleExpectStatement(innerArgs, lastNode);
          }
        },
      });

      mermaidDiagram += `    end\n`;
    }
  },
});

// Save the Mermaid diagram to a file
writeFileSync('output.mermaid', mermaidDiagram);

console.log(mermaidDiagram);
