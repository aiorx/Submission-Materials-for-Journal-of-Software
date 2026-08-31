// All functions on this page were Built with basic GitHub coding tools from the comment.

function calculateNumbers(var1, var2) {
    // A function that calculates the sum of two numbers
    return var1 + var2;
}


// A function that calculates the area of a circle
function calculateCircleArea(radius) {
    return Math.PI * radius * radius;
}

// Below this point everything, including the comment was from copilot.  I just added the comment mark then filled in whatever copilot wanted.

// A function that calculates the area of a rectangle
function calculateRectangleArea(width, height) {
    return width * height;
}

// A function that calculates the area of a triangle
function calculateTriangleArea(base, height) {
    return 0.5 * base * height;
}

// A function that calculates the area of a square
function calculateSquareArea(side) {
    return side * side;
}

// A function that calculates the area of a trapezoid
function calculateTrapezoidArea(base1, base2, height) {
    return 0.5 * (base1 + base2) * height;
}

// A function that calculates the area of a parallelogram
function calculateParallelogramArea(base, height) {
    return base * height;
}

// A function that calculates the area of a rhombus
function calculateRhombusArea(diagonal1, diagonal2) {
    return 0.5 * diagonal1 * diagonal2;
}

// A function that calculates the area of a kite
function calculateKiteArea(diagonal1, diagonal2) {
    return 0.5 * diagonal1 * diagonal2;
}

// A function that calculates the area of a regular polygon
function calculateRegularPolygonArea(perimeter, apothem) {
    return 0.5 * perimeter * apothem;
}

// A function that calculates the area of a sector
function calculateSectorArea(radius, angle) {
    return 0.5 * radius * radius * angle;
}

// A function that calculates the area of a segment
function calculateSegmentArea(radius, angle) {
    return 0.5 * radius * radius * (angle - Math.sin(angle));
}

// A function that calculates the area of an ellipse
function calculateEllipseArea(radius1, radius2) {
    return Math.PI * radius1 * radius2;
}

// A function that calculates the area of a cube
function calculateCubeArea(side) {
    return 6 * side * side;
}

// A function that calculates the area of a cuboid
function calculateCuboidArea(length, width, height) {
    return 2 * (length * width + length * height + width * height);
}

// A function that calculates the area of a cylinder
function calculateCylinderArea(radius, height) {
    return 2 * Math.PI * radius * (radius + height);
}

// A function that calculates the area of a cone
function calculateConeArea(radius, height) {
    return Math.PI * radius * (radius + Math.sqrt(radius * radius + height * height));
}

// A function that calculates the area of a sphere
function calculateSphereArea(radius) {
    return 4 * Math.PI * radius * radius;
}

// A function that calculates the area of a hemisphere
function calculateHemisphereArea(radius) {
    return 3 * Math.PI * radius * radius;
}

// A function that calculates the area of a pyramid
function calculatePyramidArea(base, slantHeight) {
    return base + 0.5 * base * slantHeight;
}

// A function that calculates the area of a prism
function calculatePrismArea(base, height) {
    return 2 * base + base * height;
}


// The below Test comment was written by me, the code was completely by copilot.
// Tests for all of the functions, comparing the function result to the known correct value.  Outputs to the terminal the result of the test.
function test() {
    let result = calculateNumbers(2, 3);
    console.log(result === 5 ? 'Test passed' : 'Test failed');

    result = calculateArea(5);
    console.log(result === 78.53981633974483 ? 'Test passed' : 'Test failed');

    result = calculateRectangleArea(5, 10);
    console.log(result === 50 ? 'Test passed' : 'Test failed');

    result = calculateTriangleArea(5, 10);
    console.log(result === 25 ? 'Test passed' : 'Test failed');

    result = calculateSquareArea(5);
    console.log(result === 25 ? 'Test passed' : 'Test failed');

    result = calculateTrapezoidArea(5, 10, 15);
    console.log(result === 112.5 ? 'Test passed' : 'Test failed');

    result = calculateParallelogramArea(5, 10);
    console.log(result === 50 ? 'Test passed' : 'Test failed');

    result = calculateRhombusArea(5, 10);
    console.log(result === 25 ? 'Test passed' : 'Test failed');

    result = calculateKiteArea(5, 10);
    console.log(result === 25 ? 'Test passed' : 'Test failed');

    result = calculateRegularPolygonArea(5, 10);
    console.log(result === 25 ? 'Test passed' : 'Test failed');

    result = calculateSectorArea(5, 10);
    console.log(result === 125 ? 'Test passed' : 'Test failed');

    result = calculateSegmentArea(5, 10);
    console.log(result === 25.0 ? 'Test passed' : 'Test failed');

    result = calculateEllipseArea(5, 10);
    console.log(result === 157.07963267948966 ? 'Test passed' : 'Test failed');

    result = calculateCubeArea(5);
    console.log(result === 150 ? 'Test passed' : 'Test failed');

    result = calculateCuboidArea(5, 10, 15);
    console.log(result === 220 ? 'Test passed' : 'Test failed');

    result = calculateCylinderArea(5, 10);
    console.log(result === 471.23889803846896 ? 'Test passed' : 'Test failed');
}

//Copilot doesn't work on mobile