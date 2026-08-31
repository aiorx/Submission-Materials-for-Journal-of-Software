//All Drafted using standard development resources
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const logos = []; // To store image data

// Array of images and their corresponding links 
const images = [
  {
    src: "../image/G1.png",
    link: "G1.html"
  },
  {
    src: "../image/G2.png",
    link: "G2.html"
  },
  {
    src: "../image/G3.png",
    link: "G3.html"
  },
  {
    src: "../image/G4.png",
    link: "G4.html"
  },
  {
    src: "../image/G5.png",
    link: "G5.html"
  },
  {
    src: "../image/G6.png",
    link: "G6.html"
  },
  {
    src: "../image/G7.png",
    link: "G7.html"
  },
  {
    src: "../image/G8.png",
    link: "G8.html"
  },
  {
    src: "../image/G9.png",
    link: "G9.html"
  },

  
];

// Desired image size
const imageWidth = 180; // Width of images in pixels
const imageHeight = 180; // Height of images in pixels

// Function to create a bouncing image
function createBouncingImage(imageData) {
  const img = document.createElement('img');
  img.src = imageData.src;
  img.className = 'bouncing-image';

  // Set image size dynamically
  img.style.width = `${imageWidth}px`;
  img.style.height = `${imageHeight}px`;

  // Wrap image in a clickable <a> tag
  const link = document.createElement('a');
  link.href = imageData.link;

  link.appendChild(img);

  document.body.appendChild(link);

  // Random initial position and velocity
  const imageObject = {
    element: link,
    posX: Math.random() * (windowWidth - imageWidth),
    posY: Math.random() * (windowHeight - imageHeight),
    velocityX: (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1),
    velocityY: (Math.random() * 4 + 2) * (Math.random() < 0.5 ? 1 : -1),
  };

  logos.push(imageObject);
}

// Create bouncing images for each item in the images array
images.forEach(createBouncingImage);

// Function to update positions of all bouncing images
function updatePositions() {
  logos.forEach(logo => {
    // Update position
    logo.posX += logo.velocityX;
    logo.posY += logo.velocityY;

    // Check for collisions with edges and reverse direction if necessary
    if (logo.posX <= 0 || logo.posX + imageWidth >= windowWidth) {
      logo.velocityX *= -1;
    }
    if (logo.posY <= 0 || logo.posY + imageHeight >= windowHeight) {
      logo.velocityY *= -1;
    }

    // Apply new position
    logo.element.style.left = logo.posX + 'px';
    logo.element.style.top = logo.posY + 'px';
    logo.element.style.position = 'absolute';
  });
}

// Animation loop
function animate() {
  updatePositions();
  requestAnimationFrame(animate);
}

// Start animation
animate();
