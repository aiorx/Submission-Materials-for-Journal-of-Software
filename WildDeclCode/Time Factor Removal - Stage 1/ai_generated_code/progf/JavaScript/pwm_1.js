// Pulse Wave Modulation (PWM) simulation
// Made to render like an old oscilloscope - lime green on black
// Most of this sim was Produced with advanced coding tools with some cleanup on placement of the slider
var canvasWidth = 600;
var canvasHeight = 200;
var dutyCycleSlider;
var dutyCycle = 0.5; // Initialize to 50%
var cycles = 6;
var waveHeight = canvasHeight/3;
var leftSliderMargin = 155; // at 16 point font

function setup() {
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  textSize(16);
  
  dutyCycleSlider = createSlider(0, 1, 0.5, 0.01); // Range from 0 to 1, default value 0.5, step size 0.01
  dutyCycleSlider.position(leftSliderMargin, canvasHeight - 35); // Position slider
  dutyCycleSlider.style('width', canvasWidth - leftSliderMargin - 20 + 'px'); // Set width of slider
}

function draw() {
  background('black');

  // Update duty cycle
  dutyCycle = dutyCycleSlider.value();
  
  // Set stroke for waveform
  stroke('limegreen');
  // disable the fill in the waveform
  noFill();
  // make the line be double wide
  strokeWeight(2);
  
  // Generate PWM waveform
  beginShape();
  for (var x = 0; x < width; x++) {
    // Map x to time period of waveform
    var t = map(x, 0, width, 0, TWO_PI * cycles);
    
    // Calculate value of waveform at this point in time
    // Draw high if in duty cycle, low otherwise
    var y = (sin(t) > 2 * dutyCycle - 1) ? 
        2*height/3 : height/3; 
    
    // Add vertex to waveform
    vertex(x, y);
  }
  endShape();
  
  // Display duty cycle
  fill('white');
  noStroke();
  // Display duty cycle as percentage
  text("Duty Cycle: " + nf(dutyCycle*100, 0, 0) + "%", 20, height - 25); 
}