// 9-1-24
// Jacob Brown

// This Script was Assisted with basic coding tools to work on the canvas in the header.
// Its not critical for the website's functioning but it makes it look a little 
// better. My main Javascript file for this week makes the navigation window appear
// when the screen resolution is below 436px with the media query.

// 9-28-24
// Since ChatGPT initially helped me to make this code, I asked it to do an inital refactoring,
// then I went through and fixed any extra bugs it did not catch. (mostly it did not detect all the "could be null" errors)

// script.js
const canvas = document.getElementById('bubble-canvas') as HTMLCanvasElement | null;
const ctx = canvas?.getContext('2d');

if (!ctx) {
  throw new Error('Canvas not found or context not available');
}
if (!canvas) {
  throw new Error('Canvas not found or context not available');
}

let bubbles: Bubble[] = [];
const numBubbles = 30;

// Resize canvas to fill window
function resizeCanvas() {
  const container = document.querySelector('.canvas-container') as HTMLElement;

  if (container) {
      const width = container.clientWidth;  // Get the container's width
      const height = container.clientHeight; // Get the container's height

      canvas!.width = width;   // Set actual pixel width
      canvas!.height = height; // Set actual pixel height
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Bubble class
class Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;

  constructor(x: number, y: number, radius: number, speed: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    ctx!.beginPath();
    ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx!.fillStyle = 'rgba(0, 150, 255, 0.5)';
    ctx!.fill();
    ctx!.closePath();
  }

  update() {
    if (this.x + this.radius > canvas!.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas!.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    this.draw();
  }
}

// Create bubbles
function createBubbles() {
  for (let i = 0; i < numBubbles; i++) {
    const radius = Math.random() * 10 + 5;
    const x = Math.random() * (canvas!.width - radius * 2) + radius;
    const y = Math.random() * (canvas!.height - radius * 2) + radius;
    const dx = Math.random() * 2 - 1;
    const dy = Math.random() * 2 - 1;
    const speed = Math.random() * 2 + 1;

    bubbles.push(new Bubble(x, y, radius, speed, dx, dy));
  }
}

createBubbles();

// Animation loop
function animate() {
  ctx!.clearRect(0, 0, canvas!.width, canvas!.height); // Clear canvas

  bubbles.forEach(bubble => bubble.update()); // Update and draw each bubble

  requestAnimationFrame(animate); // Request next frame
}

animate();
