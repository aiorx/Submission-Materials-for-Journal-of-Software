
// the below color randomization/hover JS is sourced Adapted from standard coding samples

document.addEventListener("DOMContentLoaded", function() {
  let colors = ["#D3FF87", "#FF87D3", "#87FFB6", "#FF004F", "#E4B7FF", "#B7FFFA", "#ffa591"];
          
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }
        
  let randomColor = getRandomColor(); // Get a random color once
        
  let colorElement = document.querySelector('.color');
  let linkElements = document.querySelectorAll('.link'); // Select all elements with class "link"
        
// Apply the same random color to both elements
  colorElement.style.color = randomColor;
  linkElements.forEach(function(linkElement) {
  const originalColor = window.getComputedStyle(linkElement).color;
  linkElement.dataset.originalColor = originalColor; // Store original color
  linkElement.addEventListener('mouseover', function() {
    this.style.color = randomColor;
  });
  linkElement.addEventListener('mouseout', function() {
    this.style.color = originalColor; // Reset color on mouseout
  });
  });

  let photoFrame = document.getElementById("photoFrame");
  let recipeA = document.getElementById("recipeA");
  let recipeB = document.getElementById("recipeB");
  let recipeC = document.getElementById("recipeC");
  let babel = document.getElementById("babel");
  let flex = document.getElementById("flex");
  let random = document.getElementById("random");
  let sprinkles = document.getElementById("sprinkles");
  let kelly = document.getElementById("kelly");
  let helv = document.getElementById("helv");
  let video = document.getElementById("video");
  let screensaver = document.getElementById("screensaver");
  let snoopy = document.getElementById("snoopy");
  let time = document.getElementById("time");
  
  recipeA.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/recipeA.png')";
  }

  recipeA.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  recipeB.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/recipeB.png')";
  }
  recipeB.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  recipeC.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/terrible.png')";
  }
  recipeC.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  babel.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/hexes.png')";
  }
  babel.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  flex.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/hello.png')";
  }
  flex.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  random.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/sonnet.png')";
  }
  random.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  sprinkles.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/sprinkles.png')";
  }
  sprinkles.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  kelly.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/kelly.png')";
  }
  kelly.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  helv.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/helvetica.png')";
  }
  helv.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  video.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/video.png')";
  }
  video.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  screensaver.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/screensaver.png')";
  }
  screensaver.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  snoopy.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/snoopy.png')";
  }
  snoopy.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }

  time.onmouseover = function(){
    photoFrame.style.backgroundImage = "url('sources/time.png')";
  }
  time.onmouseout = function(){
    photoFrame.style.backgroundImage = "";
  }
});