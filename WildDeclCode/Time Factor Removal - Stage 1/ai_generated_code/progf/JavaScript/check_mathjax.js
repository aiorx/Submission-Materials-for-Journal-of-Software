// I feel like there ought to be a better way to verify MathJax in a static HTML.

// The following code was Aided using standard development resources and I have not tested it at all.

var mj = require('mathjax-node');
var fs = require('fs');
var path = require('path');

mj.start();

// Function to process MathJax in a string
function processMathJax(input) {
    mj.typeset({
        math: input,
        format: "TeX", // or "inline-TeX", "MathML"
        svg: true,
    }, function (data) {
        if (data.errors) {
            console.error('MathJax processing errors:', data.errors);
        } else {
            console.log('MathJax processed successfully.');
            // You can also check data.svg for the SVG output
        }
    });
}

// Read HTML file
var filePath = 'index.html'; 
var htmlContent = fs.readFileSync(filePath, 'utf8');

// Extract and process MathJax content
// This is a basic example; you may need to refine the extraction process based on your HTML structure
var mathJaxPattern = /\$\$([^$]+)\$\$/g; // Simple regex for TeX format, adjust as needed
var match;
while ((match = mathJaxPattern.exec(htmlContent)) !== null) {
    processMathJax(match[1]);
}
