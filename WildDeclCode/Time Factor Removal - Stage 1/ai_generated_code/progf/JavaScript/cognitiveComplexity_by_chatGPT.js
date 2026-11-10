// Enhanced Cognitive Complexity calculation logic in JavaScript

// Code Composed with basic coding tools

/**
 * Calculates the Cognitive Complexity of given Python-like code.
 * @param {string} code - The source code to analyze.
 * @returns {Object} - The total complexity and detailed breakdown.
 */
function calculateCognitiveComplexity(code) {
    var totalComplexity = 0;
    var nestingLevel = 0;
    var complexities = [];
  
    var lines = code.split('\n');
  
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue; // Skip empty lines
  
        var lineComplexity = 0;
        var reasons = [];
  
        // Match control flow structures
        if (/^if\b|^elif\b/.test(line)) {
            lineComplexity = 1 + nestingLevel;
            reasons.push("+" + (lineComplexity) + " (if/elif, nesting=" + (nestingLevel) + ")");
        } else if (/^else:/.test(line)) {
            lineComplexity = 1;
            reasons.push('+1 (else)');
        } else if (/^for\b|^while\b/.test(line)) {
            lineComplexity = 1 + nestingLevel;
            reasons.push("+" + (lineComplexity) + " (loop, nesting=" + (nestingLevel) + ")");
        } else if (/^except\b/.test(line)) {
            lineComplexity = 1;
            reasons.push('+1 (except)');
        } else if (/\bbreak\b|\bcontinue\b/.test(line)) {
            lineComplexity = 1;
            reasons.push('+1 (break/continue)');
        }
  
        // Handle boolean sequences
        if (/(\s(and|or)\s)/.test(line) && !/^elif\b/.test(line)) {
            lineComplexity += 1;
            reasons.push('+1 (boolean sequence)');
        }
  
        // Track nesting
        if (/^if\b|^elif\b|^for\b|^while\b/.test(line)) {
            nestingLevel++;
        }
  
        if (/\breturn\b|\bpass\b|\braise\b/.test(line)) {
            nestingLevel = Math.max(0, nestingLevel - 1);
        } else if (i < lines.length - 1 && lines[i + 1].trim().length > 0 &&
                   lines[i + 1].search(/\S/) <= line.search(/\S/)) {
            nestingLevel = Math.max(0, nestingLevel - 1);
        }
  
        totalComplexity += lineComplexity;
        complexities.push({ line: line, complexity: lineComplexity, reasons });
    }
  
    console.log("Total Cognitive Complexity:", totalComplexity);
    console.table(complexities);
  
    return {
        total: totalComplexity,
        lineComplexities: complexities.map(function c { return ({
            line: c.line,
            value: c.complexity,
            reason: c.reasons.join(', ')
        }); }),
        complexities
    };
  }
  
  // Example usage
  var exampleCode = '
    def example_function():
        if condition1:
            for i in range(10):
                if condition2:
                    continue
        else:
            print("Done")
        return
  ';
  
  var result = calculateCognitiveComplexity(exampleCode);
  console.log("Total Cognitive Complexity:", result.totalComplexity);
  console.table(result.complexities);
  
  // Export the function as default
module.exports = calculateCognitiveComplexity;
