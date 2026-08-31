// Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }


      const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
            },
            options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
            }
        });


        // Datepicker code Penned via standard programming aids

        const datetimeInput = document.getElementById('datetime');
        const output = document.getElementById('output');

        // Example: Set minimum to current datetime
        const now = new Date();
        const isoString = now.toISOString().slice(0,16); // "YYYY-MM-DDTHH:MM"
        datetimeInput.min = isoString;

        // Show selected value
        datetimeInput.addEventListener('change', () => {
            output.textContent = `Selected: ${datetimeInput.value}`;
        });

  document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector(".js-mobile-humbuger");
    const headerElements = document.querySelector(".js-header-elements");

    if (hamburger && headerElements) {
      hamburger.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent default <a> behavior
        headerElements.classList.toggle("hidden");
      });
    }
  });


  document.getElementById("cardJavaScriptInBody").innerHTML = "this is the javascript I write for testing purpose";


  function myFunction() {
    document.getElementById("javascriptFunctionFirst").innerHTML = "<p>This Paragraph changed while clicked the bottom button.</p>";
  }


  document.getElementById("javaScriptInnerText").innerText = "Hello World this is Javascript Inner Text updated live";



let x, y, z;  // Statement 1
x = 50;        // Statement 2
y = 60;        // Statement 3
z = x + y;    // Statement 4

document.getElementById("javaScriptStatements").innerHTML = "The value of z is " + z + ".";  


document.getElementById("javaScriptNumbers").innerHTML = 25.20;


document.getElementById("javaScriptStrings").innerHTML = 'Labib Muhammad Jamal';


let a;
a = 6;
document.getElementById("javaScriptVariables").innerHTML = a;

document.getElementById("javaScriptOperators").innerHTML = (5 + 6) * 10;


let p, j;
p = 5;
j = 6;
document.getElementById("assigningJavaScriptValues").innerHTML = p + j;


document.getElementById("javaScriptExpressions").innerHTML = 5 * 10;


var h;
h = 50;
document.getElementById("expressionsComputeValues").innerHTML = h * 10;



document.getElementById("expressionsComputeValuesStrings").innerHTML = "John" + " "  + "Doe";

// let Keyword Creates Variables

let r, u; // let Keyword Creates Variables
r = 5 + 6; // Declare r, give it the value of 5 + 6 or 11
u = r * 10;
document.getElementById("letKeywordCreatesVariables").innerHTML = u;

// var Keyword Creates Variables

// var q, w;
// q = 50 + 60;
// w = q * 10;
// document.getElementById("varKeywordCreatesVariables").innerHTML = w;



var n = 5;
var m = 6;
var k = n + m;
document.getElementById("javaScriptVariablesVar").innerHTML =
"The value of k is: " + k;


let g = 9;
let v = 11;
let i = g + v;
document.getElementById("javaScriptVariableslet").innerHTML =
"The value of i is: " + i;


const q = 8;
const l = 7;
const d = q + l;
document.getElementById("javaScriptVariablesconst").innerHTML =
"The value of d is: " + d;


const price = 3;
const tax = 45;
let total = price + tax;
document.getElementById("javaScriptVariablesConstPrice").innerHTML =
"The total is: " + total;