// This code was Assisted with basic coding tools

function setup() {
    createCanvas(400, 400);
    background(220);
    var shapes = drawShapes();
    updateShapes(shapes);
  }
  
  function drawShapes() {
    for (var i = 0; i < 10; i++) {
      var x = random(width);
      var y = random(height);
      var w = random(10, 50);
      var h = random(10, 50);
      var col = color(random(255), random(255), random(255));
      fill(col);
      rect(x, y, w, h);
    }
    return document.querySelectorAll('rect');
  }
  
  function updateShapes(shapes) {
    for (var shape of shapes) {
      var x = parseFloat(shape.getAttribute('x'));
      var y = parseFloat(shape.getAttribute('y'));
      var w = parseFloat(shape.getAttribute('width'));
      var h = parseFloat(shape.getAttribute('height'));
      var col = color(random(255), random(255), random(255));
      fill(col);
      rect(x, y, w, h);
    }
  }
  
  function draw() {
    // Some code here
    var r = 20;
    var x = mouseX;
    var y = mouseY;
    ellipse(x, y, r, r);
  }
  