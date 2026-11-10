//most of this code is Produced with third-party coding tools with minor modifications from me
var canvas;
let numDrops = 300; // Number of raindrops
let drops = []; // Array to store raindrops
let bgColor = 0; // Background color

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resizenumDrops(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  for (let i = 0; i < numDrops; i++) {
    drops.push(new Raindrop());
  }
}

function draw() {
  background(bgColor); // Set background color
  
  // Check if mouse is pressed
  if (mouseIsPressed) {
    for (let i = 0; i < numDrops; i++) {
      drops[i].fall(2); // Increase speed when mouse is down
    }
    // Change background color to gradient blue
    bgColor = lerpColor(color(149, 200, 216), color(29, 41, 81), mouseY / height);
  } else {
    for (let i = 0; i < numDrops; i++) {
      drops[i].fall(1); // Decrease speed when mouse is up
    }
    // Change background color back to black
    bgColor = 255;
  }
  
  // Display and update raindrops
  for (let i = 0; i < numDrops; i++) {
    drops[i].display();
    drops[i].update();
  }
}

// Raindrop class
class Raindrop {
  constructor() {
    this.x = random(width);
    this.y = random(-500, -50);
    this.speed = random(4, 10);
  }

  fall(gravity) {
    this.y += this.speed;
    this.speed += gravity;
    
    // Reset raindrop if it reaches the bottom
    if (this.y > height) {
      this.y = random(-200, -100);
      this.speed = random(4, 10);
    }
  }

  display() {
    stroke(202, 222, 229);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y+10); // Raindrop shape
  }

  update() {
    // Add wind effect
    this.x += random(-1, 1);
    
    // Reset raindrop if it goes out of the screen
    if (this.x < 0 || this.x > width || this.y > height) {
      this.x = random(width);
      this.y = random(-200, -100);
      this.speed = random(4, 10);
    }
  }
}