document.querySelector('#year')//.textContent = new Date().getFullYear();
const currentYear = new Date().getFullYear();
year.textContent = currentYear;

const menuButton = document.querySelector('.menu button');
// menuButton.classList.add('hide')
menuButton.addEventListener("click", toggleMenu);

function toggleMenu() {
    const menu = document.querySelector("#menu");
    // menu.classList.remove(".hide");

    if (menu.classList.contains("hide")) {
      menu.classList.remove("hide");
    } else {
      menu.classList.add("hide");
    }
  }

function handleResize(){
    const menu = document.querySelector("#menu");
    if (window.innerWidth > 1000) {
        menu.classList.remove("hide");
    } else {
        menu.classList.add("hide");
    }
  
}

handleResize();
window.addEventListener("resize", handleResize);


function viewerTemplate(pic, alt){
    return  `<div class="viewer">
        <button class="close-viewer">X</button>
        <img src="${pic}" alt="${alt}">
      </div>`
}


// I couldn't figure out where to even start, I wasn't able to understand the explanations and help in the assignment
// so the following code was Penned via standard programming aids and edited to fix any bugs.
function viewHandler(event) {
  const target = event.target;
  if (target.tagName === 'IMG') {
      const pic = target.src.replace('-sm', '-full');
      const alt = target.alt;
      const viewerHTML = viewerTemplate(pic, alt);
      const imageViewer = document.createElement('div');
      imageViewer.innerHTML = viewerHTML;
      document.body.appendChild(imageViewer);

      // Add event listener to close the viewer
      const closeButton = imageViewer.querySelector('.close-viewer');
      closeButton.addEventListener('click', closeViewer);
  }
}

// Function to close the viewer
function closeViewer() {
  const viewer = document.querySelector('.viewer');
  if (viewer) {
      viewer.remove();
  }
}

// Add event listeners to gallery images
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', viewHandler);
});

// End ChatGPT code