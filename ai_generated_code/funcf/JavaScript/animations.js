```javascript
console.log("The animation was mostly Drafted using common development resources.")

// Scatter plot dimensions and margins
var win_w = window.innerWidth
var win_h = window.innerHeight
const margin = {top: 90, right: 15, bottom: 20, left: 75};
const width = .2 * win_w// 400 - margin.left - margin.right;
const height = .33 * win_h// 300 - margin.top - margin.bottom;

// Append the svg object to the body of the page
//const svg = d3.select("svg")
const svg = d3.select("#anim").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "#f2f3f4")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Function to generate correlated data
function generateCorrelatedData(n, slope, intercept, noise) {
    return d3.range(n).map(() => {
        const x = Math.random();
        const y = slope * x + intercept + d3.randomNormal(0, noise)();
        return {x: x, y: y};
    });
}

// Generate correlated data
let data = generateCorrelatedData(50, -0.3, 0.3, 0.05);

// Set the scales
let x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([0, width]);

let y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y))
    .range([height, 0]);

// Add the X Axis
const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat("").tickSize(0))
    .attr("class","axis");

// Add the Y Axis
const yAxis = svg.append("g")
    .call(d3.axisLeft(y).tickFormat("").tickSize(0))
    .attr("class","axis");

// Add the scatter dots
const dots = svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "scatter-dot")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 5);

// Function to compute the OLS regression line
function olsLine(data) {
    const xMean = d3.mean(data, d => d.x);
    const yMean = d3.mean(data, d => d.y);
    const slope = d3.sum(data, d => (d.x - xMean) * (d.y - yMean)) / d3.sum(data, d => (d.x - xMean) ** 2);
    const intercept = yMean - slope * xMean;

    return [
        [d3.min(data, d => d.x), d3.min(data, d => d.x) * slope + intercept],
        [d3.max(data, d => d.x), d3.max(data, d => d.x) * slope + intercept]
    ];
}

// Add the OLS line
let olsData = olsLine(data);

const line = d3.line()
    .x(d => x(d[0]))
    .y(d => y(d[1]));

const olsPath = svg.append("path")
    .datum(olsData)
    .attr("class", "ols-line")
    .attr("d", line);

    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min
      }
      

// Animation function
function animateData() {

    var beta = getRandomNumber(-.8,.8)
    var alpha = getRandomNumber(.25,.75)
    data = generateCorrelatedData(50, beta, alpha, 0.05);

    // Update scales
    x.domain(d3.extent(data, d => d.x));
    y.domain(d3.extent(data, d => d.y));

    // Update axes
    xAxis.transition()
      .duration(4000)
      .call(d3.axisBottom(x).tickFormat("").tickSize(0));

    yAxis.transition()
      .duration(4000)
      .call(d3.axisLeft(y).tickFormat("").tickSize(0));

    // Update dots
    dots.data(data)
        .transition()
        .duration(4000)
        .ease(d3.easeCubicInOut)
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y));

    // Update OLS line
    olsData = olsLine(data);
    olsPath.datum(olsData)
        .transition()
        .duration(4000)
        .ease(d3.easeCubicInOut)
        .attr("d", line);
}

// Animate the scatter plot every 4 seconds
setInterval(animateData, 4000);
```