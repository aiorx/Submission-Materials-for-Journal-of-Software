document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Menu button objects
const startButton = { x: 300, y: 200, width: 200, height: 50, text: "Start Game" };
const startGameButton = { x: 300, y: 300, width: 200, height: 50, text: "Continue" };
correctId = 0;

// Game canvas object
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
}



// Draw menu to the canvas
function drawMenu() {

  // Draw the title
  ctx.fillStyle = "#00053E"; // Dark blue color
  ctx.font = "40px Arial"; // Larger font for the title
  ctx.textAlign = "center";
  ctx.fillText("Buc Eye View", canvas.width / 2, 100); // Position at the top center of the canvas
  
  ctx.textAlign = "start";
  // Draw Start Game Button
  ctx.fillStyle = "#00053E";
  ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
  ctx.fillStyle = "#FFC72C";
  ctx.font = "20px Arial";
  ctx.fillText(startButton.text, startButton.x + 30, startButton.y + 30);


}

// Draws instructions to the canvas
function drawInstructions() {

  ctx.fillStyle = "#00053E";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("How to Play", canvas.width / 2, 50);

  // Instructions Text
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFC72C";

  const instructions = [
    "You’ll see five unique images from around campus, and your goal is to identify the location",
     "shown in each photo. With each image, you’ll find four multiple-choice options; tap on the one",
     "that best matches the location. You only get one guess per image, so choose carefully!",
     "Every day brings a new set of images for a fresh challenge, so come back daily",
     "to test your campus knowledge."
  ];

  let yPosition = 100; // Starting y position for instructions text

    // Display each line with a gap between lines
    instructions.forEach(line => {
        ctx.fillText(line, 50, yPosition);
        yPosition += 30; // Increase y position for the next line
    });


  // Draw instruction menu start button
  ctx.fillStyle = "#00053E";
  ctx.fillRect(startGameButton.x, startGameButton.y, startGameButton.width, startGameButton.height);
  ctx.fillStyle = "#FFC72C";
  ctx.fillText(startGameButton.text, startGameButton.x + 30, startGameButton.y + 30);
}

// Function to draw the third page with four buttons Built via standard programming aids
function drawPageThree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRandomImage();
}

// Initializes the game and shows game instructions when called
function initializeGame() {
    
    // Show the game screen
  document.getElementById("gameScreen").style.display = "block";

  // Clear the canvas and displays instructions
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawInstructions();
}