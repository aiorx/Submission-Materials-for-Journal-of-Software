// class is fully Assisted with basic coding tools:
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    rand() {
        // Constants for the LCG
        var a = 1664525;
        var c = 1013904223;
        var m = 2 ** 32;

        // Update the seed and return a random number between 0 and 1
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }
}

var random = new SeededRandom();

// constants
var REROLL_ATTEMPTS = 3;
var MAX_NUMBERS = 6;
var MAX_NESTING = 1;

// numbers will be formatted → MAX_DECIMALS after decimal point, 1 - MAX_DIGITS+MAX_DIGITS_TOLERANCE before decimal point, 
var MAX_DECIMALS = 2;
var MAX_DIGITS = 3; 
var MAX_DIGITS_TOLERANCE = 2;
var formatNumber = function (x) { return _formatNumber(x, MAX_DECIMALS, MAX_DIGITS, MAX_DIGITS_TOLERANCE)

// html elements
var div_resultContainer = document.getElementById('resultContainer'); };
var div_graphContainer = document.getElementById('graphContainer');
var input_numbersInputTextfield = document.getElementById('numbersInputTextfield');
var button_submitButton = document.getElementById("submitButton");
var input_seedInputTextfield = document.getElementById("seedInputTextfield");
var accordionButtons = document.getElementsByClassName("accordion-button");
for (var i = 0; i < accordionButtons.length; i++) {
    accordionButtons[i].addEventListener("click", function() {
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) { panel.style.maxHeight = null; } 
        else { panel.style.maxHeight = "500px"; } 
    });
} 
var input_useSeedCheckbox = document.getElementById("useSeedCheckbox");

var FUNCTIONS = [
    // base and utility functions
    {
        name: "constant",
        latex: "1",
        evaluate: function (x, param) { return 1; }, 
        parameters: []
    },
    {
        name: "linear",
        latex: "x",
        evaluate: function (x, param) { return x; },
        parameters: []
    },
    {
        name: "reciprocal", 
        latex: "\\frac{1}{${a}}",
        evaluate: function (x, param) { return 1/param[0].value.func(x, param[0].value.param); }, 
        parameters:
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    {
        name: "absolute", 
        latex: "\\left| ${a} \\right|",
        evaluate: function (x, param) { return Math.abs(param[0].value.func(x, param[0].value.param)); }, 
        parameters:
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal", "factorial", "exponential", "exponential_nested", "poly_exp_nested", "absolute" ] }
        ]
    },
    {
        name: "factorial",
        latex: "x!",
        evaluate: function (x, param) { return factorial(x); }, 
        parameters: []
    },
    // polynomials and exponentials
    {
        name: "polynomial",
        latex: "x^{${a}}",
        evaluate: function (x, param) { return x ** param[0].value; }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": 0, "max": 5, "exclude": [ 0, 1 ] }
        ]
    },
    {
        name: "polynomial_nested",
        latex: "x^{${a}}",
        evaluate: function (x, param) { return x ** param[0].value.func(x, param[0].value.param); }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    {
        name: "exponential",
        latex: "{${a}}^{x}",
        evaluate: function (x, param) { return param[0].value ** x; }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": 0, "max": 5, "exclude": [ 0, 1 ] }
        ]
    },
    {
        name: "exponential_nested",
        latex: "{${a}}^{x}",
        evaluate: function (x, param) { return param[0].value.func(x, param[0].value.param) ** x; }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal", "sine", "cosine", "tangent", "sine_nested", "cosine_nested", "tangent_nested", "natural_log", "log_base_a", "log_base_a_nested" ] }
        ]
    },
    {
        name: "poly_exp_nested",
        latex: "{${a}}^{${b}}",
        evaluate: function (x, param) { return param[0].value.func(x, param[0].value.param) ** param[1].value.func(x, param[1].value.param); }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal", "sine", "cosine", "tangent", "sine_nested", "cosine_nested", "tangent_nested", "natural_log", "log_base_a", "log_base_a_nested" ] },
            { "name": "b", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    // trigonometric functions
    {
        name: "sine",
        latex: "\\sin(${a}\\cdot x)",
        evaluate: function (x, param) { return Math.sin(param[0].value * x); }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": -20, "max": 20, "exclude": [] }
        ]
    },
    {
        name: "cosine",
        latex: "\\cos(${a}\\cdot x)",
        evaluate: function (x, param) { return Math.cos(param[0].value * x); }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": -20, "max": 20, "exclude": [] }
        ]
    },
    {
        name: "tangent",
        latex: "\\tan(${a}\\cdot x)",
        evaluate: function (x, param) { return Math.tan(param[0].value * x); }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": -20, "max": 20, "exclude": [] }
        ]
    },
    // nested trig
    {
        name: "sine_nested",
        latex: "\\sin(${a})",
        evaluate: function (x, param) { return Math.sin(param[0].value.func(x, param[0].value.param)); }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    {
        name: "cosine_nested",
        latex: "\\cos(${a})",
        evaluate: function (x, param) { return Math.cos(param[0].value.func(x, param[0].value.param)); }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    {
        name: "tangent_nested",
        latex: "\\tan(${a})",
        evaluate: function (x, param) { return Math.tan(param[0].value.func(x, param[0].value.param)); }, 
        parameters: 
        [
            { "name": "a", "type": "function", "exclude": [ "constant", "reciprocal" ] }
        ]
    },
    // logarithms
    {
        name: "natural_log",
        latex: "\\ln(x)",
        evaluate: function (x, param) { return Math.log(x); }, 
        parameters: []
    },
    {
        name: "log_base_a",
        latex: "\\log_{${a}}(x)",
        evaluate: function (x, param) { return logB(x, param[0]); }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": 0, "max": 10, "exclude": [ 0, 1 ] }
        ]
    },
    {
        name: "log_base_a_nested",
        latex: "\\log_{${a}}(${b})",
        evaluate: function (x, param) { return logB(param[1].value.func(x, param[1].value.param), param[0]); }, 
        parameters: 
        [
            { "name": "a", "type": "number", "min": 0, "max": 10, "exclude": [ 0, 1 ] },
            { "name": "b", "type": "function", "exclude": [ "constant", "reciprocal", "sine", "cosine", "tangent", "sine_nested", "cosine_nested", "tangent_nested", "natural_log", "log_base_a", "log_base_a_nested" ] }
        ]
    }
];

window.addEventListener('load', function() {
    var urlParams = new URLSearchParams(window.location.search);
    var values = urlParams.get('numbers');

    var seed = urlParams.get("seed");
    if (seed) {
        input_seedInputTextfield.value = seed;
        input_useSeedCheckbox.checked = true;
    }
    else {
        input_seedInputTextfield.value = intToBase36(Date.now());
        input_seedInputTextfield.value = seed;
        input_useSeedCheckbox.checked = false;
    }

    if (values) {
        console.log("numbers: " + String(values));
        input_numbersInputTextfield.value = values;
        handleSubmit(null);
    }
});

button_submitButton.onclick = function(event) {
    handleSubmit(event);
};

function selectFunction(idx, nest_level) {
    // set f to be the function object
    var f = FUNCTIONS[idx];
            
    var func = {
        func: f.evaluate, 
        param: [],
        latex: f.latex
    };

    for (var p_i = 0; p_i < f.parameters.length; p_i++) {
        if (f.parameters[p_i]["type"] == "number") {
            // get min and max values and excludes
            var mini = f.parameters[p_i]["min"];
            var maxi = f.parameters[p_i]["max"];
            var excludes = f.parameters[p_i]["exclude"];

            // get random value for parameter 
            var p_value = mini + (maxi-mini) * random.rand();

            // reroll parameter if not valid
            while (excludes.includes(p_value)) { 
                p_value = mini + (maxi-mini) * random.rand();
            }
            
            // add parameter to parameterlist
            func.param.push({ "name": f.parameters[p_i]["name"], "type": "number", "value": p_value});
        }
        else if (f.parameters[p_i]["type"] == "function") {
            // get excludes
            var excludes = f.parameters[p_i]["exclude"];
            var allowed_func_idx = getLegalFunctionsIndex(excludes, nest_level);

            // roll function type by selecting random index
            var randomIndex = allowed_func_idx[Math.floor(random.rand() * allowed_func_idx.length)];

            var i_func = selectFunction(randomIndex, nest_level + 1);
            
            // add parameter to parameterlist
            func.param.push({ "name": f.parameters[p_i]["name"], "type": "function", "value": i_func});
        }
    }

    return func;
}

function getLegalFunctionsIndex(excludes, nest_level) {
    var allow_nesting = !(nest_level==MAX_NESTING);
    var allowed_func_idx = [];

    for (var i = 0; i < FUNCTIONS.length; i++) {
        var element = FUNCTIONS[i];
        if (excludes.includes(element.name)) { continue; }
        if (!allow_nesting && element.name.endsWith("_nested")) { continue; }

        allowed_func_idx.push(i);
    }

    return allowed_func_idx;
}

function calculateCoefficients(funcs, nums) {
    var n = nums.length;
    
    // calculation step
    // Create the n by n matrix A by applying selected functions to user numbers
	var matrixA = [];
    for (var i = 1; i <= n; i++) {
        var row = [];
        funcs.forEach(function (func) {
            var res = func.func(i, func.param);
            row.push(res);
        });
        matrixA.push(row);
    }
    // Calculate the inverse of matrix A
    var matrixAInverse = math.inv(matrixA);
    // Create vector v from user numbers
    var vectorV = nums.slice();
    
    // Calculate the coefficients for selected functions
    return math.multiply(matrixAInverse, vectorV);
}

function selectRandomFunctions(n) {
    var selectedFunctions = [];
    var selectedIndices = [];
    for (var i = 0; i < n;) {
        // roll function type by selecting random index
        var randomIndex = Math.floor(random.rand() * FUNCTIONS.length);
        // reroll function if same function is already used
        var attempt = 0;
        while (selectedIndices.includes(randomIndex) && attempt < REROLL_ATTEMPTS) {
            randomIndex = Math.floor(random.rand() * FUNCTIONS.length);
        }
        
        var func = selectFunction(randomIndex, 0);

        // push function and random index
        selectedFunctions.push(func);
        selectedIndices.push(randomIndex);
        i++;
    }

    return selectedFunctions;
}

function handleSubmit(event) {
    // set seed
    if (!input_useSeedCheckbox.checked) {
        var seed = intToBase36(Date.now());
        input_seedInputTextfield.value = seed;
    }
    random.seed = base36ToInt(input_seedInputTextfield.value);
    
    // prevents default behavior
    if (event) {
        event.preventDefault();
    }

    // get numbers from input
    var inputNumbers = input_numbersInputTextfield.value.trim().split(' ').map(Number);

    // check if all entered numbers are valid
    if (inputNumbers.some(isNaN)) {
        div_resultContainer.textContent = "Please enter valid numbers separated by space.";
        return;
    }

    // check if at least numbers
    if (inputNumbers.length < 2) {
        div_resultContainer.textContent = "Please enter at least two numbers for prediction.";
        return;
    }

    // check if max numbers is surpassed
    if (inputNumbers.length > MAX_NUMBERS) {
        div_resultContainer.textContent = "Please enter no more than " + String(MAX_NUMBERS) + " numbers for prediction. ";
        return;
    } 

    // Select n random functions where n is the number of user numbers
    var n = inputNumbers.length;
    

    var selectedFunctions = null;
    var coefficients = null;
    var isSelectionValid = false;
    while (!isSelectionValid) {
        console.log("selecting Functions. ");
        
        // select n functions
        selectedFunctions = selectRandomFunctions(n);
        
        // calculation step
        try {
            coefficients = calculateCoefficients(selectedFunctions, inputNumbers);
        }
        catch (e) { 
            console.log("Couldn't calculate inverse of Matrix. ");
            continue; 
        }
        
        isSelectionValid = !coefficients.some(isNaN);
    }

    // Generate the prediction function in LaTeX
    var desmosGraphFunction = buildDesmosFunction(selectedFunctions, coefficients)

    // displayed function
    var displayedFunction = buildDisplayedFunction(selectedFunctions, coefficients);

    // Calculate the next value using the predicted function
    var nextValue = calculate(selectedFunctions, coefficients, n + 1);

    // Display the prediction result
    div_resultContainer.innerHTML = '';

    var paragraph1 = document.createElement('p');
    paragraph1.innerHTML = "Predicted Function: <br><br>$" + displayedFunction + "$";
    div_resultContainer.appendChild(paragraph1);
    
    var paragraph2 = document.createElement('p');
    paragraph2.innerHTML = "Predicted next value: <br><br>$" + nextValue + "$";
    div_resultContainer.appendChild(paragraph2);

    // render the Latex
    MathJax.typesetPromise();

    // draw the graph
    var minVal = Math.min.apply(null, inputNumbers);
    minVal = Math.min(0, nextValue, minVal) - 3;
    var maxVal = Math.max.apply(null, inputNumbers);
    maxVal = Math.max(0, nextValue, maxVal) + 3;
    graphFunction(div_graphContainer, desmosGraphFunction, minVal, maxVal);
}

function formatLatex(func) {
    var latex_str = func.latex;
    func.param.forEach(function (p) {
        if (p["type"] == "number") {
            latex_str = latex_str.replace("${" + p["name"] + "}", String(p["value"]));
        }
        else if (p["type"] == "function") {
            var p_latex_str = formatLatex(p["value"]);
            latex_str = latex_str.replace("${" + p["name"] + "}", p_latex_str);
        }
    });

    return latex_str;
}

function formatLatexShort(func) {
    var latex_str = func.latex;
    func.param.forEach(function (p) {
        if (p["type"] == "number") {
            latex_str = latex_str.replace("${" + p["name"] + "}", formatNumber(p["value"]));
        }
        else if (p["type"] == "function") {
            var p_latex_str = formatLatexShort(p["value"]);
            
            latex_str = latex_str.replace("${" + p["name"] + "}", p_latex_str);
        }
    });

    return latex_str;
}

function buildDisplayedFunction(funcs, coeffs) {
    // displayed function
    var displayedFunction = "\\begin{align} f(x) &= ";
    
    var maxlength = Math.ceil(Math.floor(window.innerWidth / 250) / 1.5);
    var length = 1;
    funcs.forEach(function (func, index) {
        if (coeffs[index] == 0) { return; }
        if (length >= maxlength && index != 0) {
            displayedFunction += "\\\\ &";
            length = 0;
        }
        var coeff = coeffs[index];
        if (index != 0) {
            displayedFunction += (coeffs[index] >= 0) ? " + " : " - ";
            coeff = Math.sign(coeff) * coeff;
        }
        displayedFunction += "" + (formatNumber(coeff)) + " \\cdot " + (formatLatexShort(func)) + "";
        length++;
    });
    displayedFunction += "\\end{align}";
    return displayedFunction;
}

function buildDesmosFunction(funcs, coeffs) {
    // displayed function
    var desmosFunction = "f(x) = ";
    funcs.forEach(function (func, index) {
        if (coeffs[index] == 0) { return; }
        var coeff = coeffs[index];
        if (index != 0) {
            desmosFunction += (coeffs[index] >= 0) ? " + " : " - ";
            coeff = (Math.sign(coeffs[index]) * coeffs[index]);
        }
        desmosFunction += "" + (coeff) + " \\cdot " + (formatLatex(func)) + "";
    });
    desmosFunction = convertScientificToLatex(desmosFunction);

    return desmosFunction;
}

function convertScientificToLatex(scientificStr) {
    var pattern = /([-+]?\d*\.?\d+)[eE]([-+]?\d+)/g;
    var replacement = '$1\\cdot 10^{$2}';
    return scientificStr.replace(pattern, replacement);
}

function factorial(n) {
    if (n < 0) return undefined; // Factorial is not defined for negative numbers
    var result = 1;
    for (var i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate(funcs, coeff, x) {
    var result = 0;

    for (var i = 0; i < funcs.length; i++) {
        result += coeff[i] * funcs[i].func(x, funcs[i].param)
    }

    return result;
}

function graphFunction(destination, latex_str, minVal, maxVal, num_points=10) {
    destination.innerHTML = "";
    // initiallize calculator
    var options = {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        // lockViewport: true,
        pointsOfInterest: false,
        zoomButtons: true,
        trace: false,
        authorFeatures: true
    }
    calculator = Desmos.GraphingCalculator(destination, options);

    // add function
    var f = {
        latex: latex_str,
        color: Desmos.Colors.BLUE
    };
    calculator.setExpression(f);

    // add points
    var p_latex = "[";
    for (var i = 0; i < num_points; i++) {
        p_latex += "(" + String(i+1) + ", f(" + String(i+1) + ")), ";
    }
    p_latex += "(" + String(num_points) + ", f(" + String(num_points) +"))]"
    var points = {
        latex: p_latex,
        showLabel: true,
        style: Desmos.Styles.CROSS,
        color: Desmos.Colors.RED
    };
    calculator.setExpression(points);
    
    // set bounds
    calculator.setMathBounds({
        left: 0,
        right: num_points + 1,
        bottom: minVal,
        top: maxVal
    });
}

function logB(x, base) {
    return Math.log(x) / Math.log(base);
}

function _formatNumber(x, max_decimals, max_digits, min_digits_dif) {
    var sign = Math.sign(x);
    var val = Math.abs(x);

    var rep = "";
    if (sign < 0) {
        rep += "-";
    }
    var magnitude = Math.floor(Math.log10(val));
    if (magnitude < 0) {
        if (-magnitude <= max_decimals && trimEndZeros(String((val*10**(-magnitude)).toFixed(max_decimals)))) {
            rep += String(val.toFixed(max_decimals))
        }
        else {
            rep += String((val*10**(-magnitude)).toFixed(max_decimals));
            rep = trimEndZeros(rep);
            rep += "\\cdot 10^{" + String(magnitude) + "}";
        }    
    }
    else if (magnitude - max_digits >= min_digits_dif) {
        var e = max_digits - magnitude - 1;
        rep += String((val*10**e).toFixed(max_decimals));
        rep = trimEndZeros(rep);
        rep += "\\cdot 10^{" + String(-e) + "}";
    }
    else {
        rep += String(val.toFixed(max_decimals));
        rep = trimEndZeros(rep);
    }

    return rep;
}



function trimEndZeros(str) {
    var end = str.length;
    
    while(end > 0 && str[end - 1] === "0") {
        --end;
    }
    if (str[end - 1] === ".") { --end; }

    return (end < str.length) ? str.substring(0, end) : str;
}

function base36ToInt(base36) {
    return parseInt(base36, 36);
}

function intToBase36(int) {
    return int.toString(36).toUpperCase();
}
